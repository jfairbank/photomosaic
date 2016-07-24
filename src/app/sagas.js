/* eslint-disable object-shorthand,no-param-reassign */
import compact from 'lodash/compact';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import download from 'downloadjs';
import * as actions from 'actions';

import {
  getMainImageForProcessing,
  getMainImageCrop,
  getTiles,
  getPhotomosaic,
} from './selectors';

import {
  TILE_COMPARISON_SIZE,
  TILE_SIZE,
  MAIN_IMAGE_MAX_SIZE_CROPPING,
  MAIN_IMAGE_MAX_SIZE,
} from './config';

import {
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  CONFIRM_TILES,
  DOWNLOAD_PHOTOMOSAIC,
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

function* processMainImageWorker(workers, mainImage, maxSize) {
  const message = [
    mainImage.width,
    mainImage.height,
    maxSize,
    mainImage.buffer,
  ];

  const result = yield call(workers.runTask, 'processMainImage', message);

  return result;
}

function computeInitialCrop(mainImageForCropping) {
  const { width, height } = mainImageForCropping;

  const minDimension = Math.min(width, height);
  const initialWidth = minDimension * 0.75;

  const initialWidthPercentage = ((initialWidth / width) * 100) | 0;
  const initialHeightPercentage = ((initialWidth / height) * 100) | 0;

  const initialX = (width - initialWidth) / 2;
  const initialY = (height - initialWidth) / 2;

  const initialXPercentage = ((initialX / width) * 100) | 0;
  const initialYPercentage = ((initialY / height) * 100) | 0;

  return {
    x: initialXPercentage,
    y: initialYPercentage,
    width: initialWidthPercentage,
    height: initialHeightPercentage,
    aspect: 1,
  };
}

function* decodeImage(workers, buffer) {
  const result = yield call(workers.runTask, 'decodeImage', buffer);

  if (result.error) {
    throw new Error(result.error);
  }

  return result.data;
}

const createProcessMainImage = (workers) => function* processMainImage(action) {
  const [file] = action.payload;
  const buffer = yield call(readFile, file);
  const mainImage = yield call(decodeImage, workers, buffer);

  const [mainImageForCropping, mainImageForProcessing] = yield [
    call(
      processMainImageWorker,
      workers,
      mainImage,
      MAIN_IMAGE_MAX_SIZE_CROPPING
    ),

    call(
      processMainImageWorker,
      workers,
      mainImage,
      MAIN_IMAGE_MAX_SIZE
    ),
  ];

  const mainImageCrop = yield call(computeInitialCrop, mainImageForCropping);

  yield put(actions.selectMainImage({
    mainImageForProcessing,
    mainImageCrop,

    // Don't need the buffer
    mainImageForCropping: {
      url: mainImageForCropping.url,
      width: mainImageForCropping.width,
      height: mainImageForCropping.height,
    },
  }));
};

function* processTile(workers, buffer) {
  const response = yield call(
    workers.runTask,
    'processTile',
    [TILE_SIZE, buffer]
  );

  yield put(actions.incrementNumUploadedTiles());

  if (response.error) {
    return null;
  }

  return response.data;
}

const createProcessTiles = (workers) => function* processTiles(action) {
  const files = action.payload;
  const buffers = yield files.map(file => call(readFile, file));

  let tiles = yield buffers.map(buffer => call(processTile, workers, buffer));

  // Remove any null's from errors
  tiles = compact(tiles);

  yield put(actions.addTiles(tiles));
};

function* computePhotomosaicDiff(workers, mainImage, tileBuffer) {
  const message = [
    mainImage.width,
    mainImage.height,
    TILE_COMPARISON_SIZE,
    TILE_SIZE,
    mainImage.buffer,
    tileBuffer,
  ];

  const diff = yield call(
    workers.runTask,
    'computePhotomosaicDiff',
    message
  );

  return diff;
}

function* computePhotomosaic(workers, mainImage, tiles, diffs) {
  const message = [
    mainImage.width,
    mainImage.height,
    TILE_COMPARISON_SIZE,
    TILE_SIZE,
    tiles.map(tile => tile.buffer),
    diffs,
  ];

  const photomosaic = yield call(
    workers.runTask,
    'computePhotomosaic',
    message
  );

  return photomosaic;
}

function* getMainImageForPhotomosaic(
  workers,
  { mainImage, tileComparisonDimension, maxSize, crop }
) {
  const message = [
    mainImage.width,
    mainImage.height,
    tileComparisonDimension,
    maxSize,
    crop,
    mainImage.buffer,
  ];

  const newMainImage = yield call(
    workers.runTask,
    'getMainImageForPhotomosaic',
    message
  );

  return newMainImage;
}

const createGeneratePhotomosaic = (workers) => function* generatePhotomosaic() {
  const [tiles, mainImageForProcessing, mainImageCrop] = yield [
    select(getTiles),
    select(getMainImageForProcessing),
    select(getMainImageCrop),
  ];

  const mainImage = yield call(getMainImageForPhotomosaic, workers, {
    mainImage: mainImageForProcessing,
    tileComparisonDimension: TILE_COMPARISON_SIZE,
    maxSize: MAIN_IMAGE_MAX_SIZE,
    crop: mainImageCrop,
  });

  const diffs = yield tiles.map(tile => (
    call(
      computePhotomosaicDiff,
      workers,
      mainImage,
      tile.buffer
    )
  ));

  const photomosaic = yield call(
    computePhotomosaic,
    workers,
    mainImage,
    tiles,
    diffs
  );

  yield put(actions.setPhotomosaic(photomosaic));
};

function* downloadPhotomosaic() {
  const { fullUrl } = yield select(getPhotomosaic);
  yield call(download, fullUrl, 'photomosaic.jpg', 'image/jpeg');
}

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    [UPLOAD_TILES]: createProcessTiles(workers),
    [CONFIRM_TILES]: createGeneratePhotomosaic(workers),
    [DOWNLOAD_PHOTOMOSAIC]: downloadPhotomosaic,
  });
}
