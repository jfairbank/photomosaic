/* eslint-disable object-shorthand,no-param-reassign */
import compact from 'lodash/compact';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import nj from 'numjs';
import * as actions from './actions';
import { getMainImageForProcessing, getMainImageCrop, getTiles } from './selectors';
import { boundAtSmallerDimension } from '../lib/utils';
import { getImageArray } from '../lib/image';

import {
  // TILE_COMPARISON_SIZE,
  TILE_SIZE,
  MAIN_IMAGE_MAX_SIZE_CROPPING,
  MAIN_IMAGE_MAX_SIZE,
} from './config';

import {
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  CONFIRM_TILES,
} from './actionTypes';

function controller(map) {
  return takeEvery(Object.keys(map), (action) => {
    const handler = map[action.type];

    if (typeof handler === 'function') {
      return handler(action);
    }

    return handler;
  });
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => resolve(result);
    reader.readAsArrayBuffer(file);
  });
}

function* resize(workers, { data, width, height, newWidth, newHeight }) {
  const message = [width, height, newWidth, newHeight, 4, false, data];
  const resizedData = yield call(workers.runTask, 'resizeImage', message);

  return resizedData;
}

// function* resizeTile(workers, imageInfo) {
//   const { width, height } = imageInfo;

//   const data = yield call(resize, workers, {
//     width,
//     height,
//     newWidth: TILE_COMPARISON_SIZE,
//     newHeight: TILE_COMPARISON_SIZE,
//     data: imageInfo.data,
//   });

//   return {
//     data,
//     width: TILE_COMPARISON_SIZE,
//     height: TILE_COMPARISON_SIZE,
//   };
// }

function* getUrlForImageBuffer(workers, buffer, width, height) {
  const message = [width, height, 100, buffer];
  const response = yield call(workers.runTask, 'dataURL', message);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

function processMainImageWorker(workers, buffer, maxSize) {
  return call(
    workers.runTask,
    'processMainImage',
    [maxSize, buffer]
  );
}

const createProcessMainImage = (workers) => function* processMainImage(action) {
  const [file] = action.payload;
  const buffer = yield call(readFile, file);

  const [mainImageForCropping, mainImageForProcessing] = yield [
    processMainImageWorker(workers, buffer, MAIN_IMAGE_MAX_SIZE_CROPPING),
    processMainImageWorker(workers, buffer, MAIN_IMAGE_MAX_SIZE),
  ];

  yield call(workers.terminatePool, 'processMainImage');

  yield put(actions.selectMainImage({
    mainImageForCropping,
    mainImageForProcessing,
  }));
};

function* processTile(workers, buffer) {
  const response = yield call(
    workers.runTask,
    'processTile',
    [TILE_SIZE, buffer]
  );

  if (response.error) {
    return null;
  }

  return response.data;
}

const createProcessTiles = (workers) => function* processTiles(action) {
  const files = action.payload;
  const buffers = yield files.map(file => call(readFile, file));

  let tiles = yield buffers.map(buffer => call(processTile, workers, buffer));
  tiles = compact(tiles);

  yield put(actions.addTiles(tiles));
};

function* computePhotomosaicDiff(workers, mainImage, tileBuffer) {
  const message = [
    mainImage.shape[1],
    mainImage.shape[0],
    // TILE_COMPARISON_SIZE,
    TILE_SIZE,
    mainImage.selection.data,
    tileBuffer,
  ];

  const diff = yield call(
    workers.runTask,
    'computePhotomosaicDiff',
    message
  );

  return diff;
}

function cropMainImageToSquare(mainImage, crop) {
  const x = ((crop.x / 100) * mainImage.shape[1]) | 0;
  const y = ((crop.y / 100) * mainImage.shape[0]) | 0;

  let width = ((crop.width / 100) * mainImage.shape[1]) | 0;
  let height = ((crop.height / 100) * mainImage.shape[0]) | 0;

  // Make square
  if (width > height) {
    width = height;
  } else if (height > width) {
    height = width;
  }

  const croppedArray = mainImage
    .slice([y, y + height], [x, x + width])
    .flatten()
    .tolist();

  const croppedMainImage = nj
    .uint8(croppedArray)
    .reshape(height, width, 4);

  return croppedMainImage;
}

function* cropAndResizeMainImageToSquare(
  workers,
  { mainImage, crop, maxWidth, maxHeight }
) {
  const croppedMainImage = yield call(cropMainImageToSquare, mainImage, crop);

  const { width, height } = yield call(boundAtSmallerDimension, {
    maxWidth,
    maxHeight,
    width: croppedMainImage.shape[1],
    height: croppedMainImage.shape[0],
  });

  // const finalWidth = width - (width % TILE_COMPARISON_SIZE);
  // const finalHeight = height - (height % TILE_COMPARISON_SIZE);

  const finalWidth = width - (width % TILE_SIZE);
  const finalHeight = height - (height % TILE_SIZE);

  const resizedData = yield call(resize, workers, {
    data: croppedMainImage.selection.data,
    width: croppedMainImage.shape[1],
    height: croppedMainImage.shape[0],
    newWidth: finalWidth,
    newHeight: finalHeight,
  });

  const newImage = nj
    .uint8(resizedData)
    .reshape(finalHeight, finalWidth, 4);

  return newImage;
}

function* computePhotomosaic(workers, mainImage, tiles, diffs) {
  const message = [
    mainImage.shape[1],
    mainImage.shape[0],
    // TILE_COMPARISON_SIZE,
    TILE_SIZE,
    mainImage.selection.data,
    // tiles.map(tile => tile.data.selection.data),
    tiles.map(tile => tile.buffer),
    diffs,
  ];

  const photomosaicBuffer = yield call(
    workers.runTask,
    'computePhotomosaic',
    message
  );

  const photomosaic = nj
    .uint8(photomosaicBuffer)
    .reshape(mainImage.shape[0], mainImage.shape[1], 4);

  return photomosaic;
}

function* generatePhotomosaic(workers) {
  const [tiles, mainImageForProcessing, mainImageCrop] = yield [
    select(getTiles),
    select(getMainImageForProcessing),
    select(getMainImageCrop),
  ];

  const mainImage = yield call(
    getImageArray,
    mainImageForProcessing.buffer,
    mainImageForProcessing.width,
    mainImageForProcessing.height
  );

  const finalMainImage = yield call(cropAndResizeMainImageToSquare, workers, {
    mainImage,
    crop: mainImageCrop,
    maxWidth: MAIN_IMAGE_MAX_SIZE,
    maxHeight: MAIN_IMAGE_MAX_SIZE,
  });

  const diffs = yield tiles.map(tile => (
    call(
      computePhotomosaicDiff,
      workers,
      finalMainImage,
      tile.buffer
    )
  ));

  const photomosaic = yield call(
    computePhotomosaic,
    workers,
    finalMainImage,
    tiles,
    diffs
  );

  const url = yield call(
    getUrlForImageBuffer,
    workers,
    photomosaic.selection.data,
    photomosaic.shape[1],
    photomosaic.shape[0]
  );

  yield put(actions.setPhotomosaic({
    url,
    data: finalMainImage,
  }));
}

const createAfterConfirmTiles = (workers) => function* afterConfirmTiles(action) {
  yield [
    call(workers.terminatePool, 'processTile'),
    call(generatePhotomosaic, workers, action),
  ];
};

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    [UPLOAD_TILES]: createProcessTiles(workers),
    [CONFIRM_TILES]: createAfterConfirmTiles(workers),
  });
}
