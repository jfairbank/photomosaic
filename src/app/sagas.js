/* eslint-disable object-shorthand,no-param-reassign */
// import flow from 'lodash/flow';
import compact from 'lodash/compact';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import nj from 'numjs';
import { IMAGE_TILE_FACTOR } from './config';
import * as actions from './actions';
import { getMainImage, getMainImageCrop } from './selectors';

import {
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  SELECT_TILES,
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
  const messages = [
    ['setup', width, height, newWidth, newHeight, 4, false],
    ['resize', data],
  ];

  const resizedData = yield call(
    workers.runTasksSequentially,
    'resizeImage',
    messages
  );

  return resizedData;
}

function getBoundedDimensions({ width, height, maxWidth, maxHeight }) {
  if (height > width && height > maxHeight) {
    return {
      width: (maxHeight * (width / height)) | 0,
      height: maxHeight,
    };
  }

  if (width > height && width > maxWidth) {
    return {
      width: maxWidth,
      height: (maxWidth * (height / width)) | 0,
    };
  }

  if (height > maxHeight && width > maxWidth) {
    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  return { width, height };
}

function* resizeTile(workers, imageInfo) {
  const { width, height } = imageInfo;

  const data = yield call(resize, workers, {
    width,
    height,
    newWidth: IMAGE_TILE_FACTOR,
    newHeight: IMAGE_TILE_FACTOR,
    data: imageInfo.data,
  });

  return {
    data,
    width: IMAGE_TILE_FACTOR,
    height: IMAGE_TILE_FACTOR,
  };
}

function* getUrlForImageBuffer(workers, buffer, width, height) {
  const messages = [
    ['setup', width, height, 100],
    ['toDataURL', buffer],
  ];

  const response = yield call(workers.runTasksSequentially, 'dataURL', messages);

  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
}

const createProcessMainImage = (workers) => function* processMainImage(action) {
  const [file] = action.payload;
  const buffer = yield call(readFile, file);

  const imageInfo = yield call(
    workers.runTask,
    'decodeImage',
    buffer
  );

  const boundedDimensions = getBoundedDimensions({
    width: imageInfo.width,
    height: imageInfo.height,
    maxWidth: 1000,
    maxHeight: 1000,
  });

  const resizedData = yield call(resize, workers, {
    data: imageInfo.data,
    width: imageInfo.width,
    height: imageInfo.height,
    newWidth: boundedDimensions.width,
    newHeight: boundedDimensions.height,
  });

  const imageArray = nj
    .uint8(imageInfo.data)
    .reshape(imageInfo.height, imageInfo.width, 4);

  const resizedImageArray = nj
    .uint8(resizedData)
    .reshape(boundedDimensions.height, boundedDimensions.width, 4);

  const url = yield call(
    getUrlForImageBuffer,
    workers,
    resizedData,
    boundedDimensions.width,
    boundedDimensions.height
  );

  const mainImageForCropping = {
    url,
    data: resizedImageArray,
  };

  yield put(actions.selectMainImage({
    mainImageForCropping,
    mainImage: imageArray,
  }));
};

const createProcessTiles = (workers) => function* processTiles(action) {
  const files = action.payload;
  const buffers = yield files.map(file => call(readFile, file));

  const imageInfos = yield compact(buffers).map(buffer => (
    call(workers.runTask, 'decodeImage', buffer)
  ));

  const resizeResults = yield compact(imageInfos).map(imageInfo => (
    call(resizeTile, workers, imageInfo)
  ));

  // const urls = yield compact(resizeResults).map(resizeResult => (
  //   call(
  //     getUrlForImageBuffer,
  //     workers,
  //     resizeResult.data,
  //     resizeResult.width,
  //     resizeResult.height
  //   )
  // ));

  // const tiles = compact(urls).map((url, i) => {
  const tiles = compact(resizeResults).map(resizeResult => {
    // const resizeResult = resizeResults[i];

    const resizedImageArray = nj
      .uint8(resizeResult.data)
      .reshape(resizeResult.height, resizeResult.width, 4);

    return {
      // url,
      data: resizedImageArray,
    };
  });

  yield put(actions.selectTiles(tiles));

  // let tiles = yield files.map(file => call(processTile, file));
  // tiles = tiles.filter(({ shape: [,,channels] }) => channels === 3)
  // yield put(actions.selectTiles(tiles));

  // const tilesArray = nj.zeros([
  //   tiles.length,
  //   IMAGE_TILE_FACTOR,
  //   IMAGE_TILE_FACTOR,
  //   3,
  // ]);

  // for (let i = 0, l = tiles.length; i < l; i++) {
  //   tilesArray
  //     .slice([i, i + 1])
  //     .assign([tiles[i].tolist()], false);
  // }

  // yield put(actions.selectTiles(tilesArray));
};

function* computePhotomosaicDiff(workers, mainImage, tile) {
  const message = [
    mainImage.shape[1],
    mainImage.shape[0],
    IMAGE_TILE_FACTOR,
    mainImage.selection.data,
    tile.selection.data,
  ];

  const diff = yield call(
    workers.runTask,
    'computePhotomosaicDiff',
    message
  );

  return diff;
}

function cropMainImageToSquare(mainImage, crop) {
  // console.group('cropMainImageToSquare');
  // console.log('mainImage.shape', mainImage.shape);
  // console.log('crop', crop);
  const x = ((crop.x / 100) * mainImage.shape[1]) | 0;
  const y = ((crop.y / 100) * mainImage.shape[0]) | 0;

  // console.log('x', x);
  // console.log('y', y);

  let width = ((crop.width / 100) * mainImage.shape[1]) | 0;
  let height = ((crop.height / 100) * mainImage.shape[0]) | 0;

  // console.log('width before', width);
  // console.log('height before', height);

  // Make square
  if (width > height) {
    width = height;
  } else if (height > width) {
    height = width;
  }

  // const [x, y, width, height] = [14, 0, 733, 733];
  // console.log('width after', width);
  // console.log('height after', height);
  // console.log('slice', [y, y + height], [x, x + width]);

  const croppedArray = mainImage
    .slice([y, y + height], [x, x + width])
    .flatten()
    .tolist();

  const croppedMainImage = nj
    .uint8(croppedArray)
    .reshape(height, width, 4);

  // console.log('croppedMainImage.shape', croppedMainImage.shape);
  // console.log('same?', croppedMainImage.selection.data === mainImage.selection.data);
  // console.groupEnd();

  return croppedMainImage;
}

function* cropAndResizeMainImageToSquare(
  workers,
  { mainImage, crop, maxWidth, maxHeight }
) {
  const croppedMainImage = yield call(cropMainImageToSquare, mainImage, crop);

  const { width, height } = yield call(getBoundedDimensions, {
    maxWidth,
    maxHeight,
    width: croppedMainImage.shape[1],
    height: croppedMainImage.shape[0],
  });

  const finalWidth = width - (width % IMAGE_TILE_FACTOR);
  const finalHeight = height - (height % IMAGE_TILE_FACTOR);

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
    IMAGE_TILE_FACTOR,
    mainImage.selection.data,
    tiles.map(tile => tile.data.selection.data),
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

const createGeneratePhotomosaic = (workers) => function* generatePhotomosaic(action) {
  const tiles = action.payload;

  const [mainImage, mainImageCrop] = yield [
    select(getMainImage),
    select(getMainImageCrop),
  ];

  const finalMainImage = yield call(cropAndResizeMainImageToSquare, workers, {
    mainImage,
    crop: mainImageCrop,
    maxWidth: 2000,
    maxHeight: 2000,
  });

  // console.log('before mainImageInfo');
  // const mainImageInfo = {
  //   data: mainImage.selection.data,
  //   width: mainImage.shape[1],
  //   height: mainImage.shape[0],
  // };
  // console.log('after mainImageInfo');

  // console.log('before resizeResult');
  // const resizeResult = yield call(
  //   resizeMainImageToSquare,
  //   workers,
  //   mainImageInfo,
  //   2000,
  //   2000
  // );
  // console.log('after resizeResult', resizeResult);

  // console.log('before croppedResizedMainImage 1');
  // let croppedResizedMainImage = nj
  //   .uint8(resizeResult.data)
  //   .reshape(resizeResult.height, resizeResult.width, 4);
  // console.log('after croppedResizedMainImage 1');

  // console.log('before croppedResizedMainImage 2');
  // croppedResizedMainImage = yield call(
  //   cropMainImageToSquare,
  //   croppedResizedMainImage,
  //   mainImageCrop
  // );
  // console.log('after croppedResizedMainImage 2', croppedResizedMainImage);

  // console.log('before diffs');
  const diffs = yield tiles.map(tile => (
    call(
      computePhotomosaicDiff,
      workers,
      finalMainImage,
      tile.data
    )
  ));
  // window.diffs = diffs;

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
    // finalMainImage.selection.data,
    // finalMainImage.shape[1],
    // finalMainImage.shape[0]
  );

  yield put(actions.setPhotomosaic({
    url,
    data: finalMainImage,
  }));
};

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    [UPLOAD_TILES]: createProcessTiles(workers),
    [SELECT_TILES]: createGeneratePhotomosaic(workers),
    // [FINALIZE_MAIN_IMAGE_CROP]: applyMainImageCrop,
  });
}
