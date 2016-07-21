/* eslint-disable object-shorthand,no-param-reassign */
// import flow from 'lodash/flow';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
// import { call, put } from 'redux-saga/effects';
import nj from 'numjs';
import ndarray from 'ndarray';
import tileArray from 'ndarray-tile';
import awise from 'ndarray-awise-prototype';
import { IMAGE_TILE_FACTOR } from './config';
import * as actions from './actions';
import { resize, removeAlphaChannel } from './utils';

import {
  getResizedCroppedMainImageData,
  getImageTilesData,
} from './selectors';

import {
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  SELECT_TILES,
  // FINALIZE_MAIN_IMAGE_CROP,
} from './actionTypes';

// function identity(value) {
//   return value;
// }

function controller(map) {
  return takeEvery(Object.keys(map), (action) => {
    const handler = map[action.type];

    if (typeof handler === 'function') {
      return handler(action);
    }

    return handler;
  });
}

function sendMessage(worker, message, wait = true) {
  if (!wait) {
    worker.postMessage(message);
    return Promise.resolve();
  }

  return new Promise(resolve => {
    worker.onmessage = (e) => {
      worker.onmessage = null;
      resolve(e.data);
    };

    worker.postMessage(message);
  });
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ({ target: { result } }) => resolve(result);
    // reader.readAsDataURL(file);
    reader.readAsArrayBuffer(file);
  });
}

function getImageData(url) {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => resolve(nj.images.read(img));
    img.src = url;
  });
}

function resizeTile(data) {
  return resize(data, IMAGE_TILE_FACTOR, IMAGE_TILE_FACTOR);
}

function* resizeMainImage(worker, imageInfo) {
  const MAX_WIDTH = 2000;
  const MAX_HEIGHT = 2000;
  const { height, width } = imageInfo;

  let newHeight;
  let newWidth;

  if (height > width && height > MAX_HEIGHT) {
    newHeight = MAX_HEIGHT;
    newWidth = (newHeight * (width / height)) | 0;
  } else if (width > height && width > MAX_WIDTH) {
    newWidth = MAX_WIDTH;
    newHeight = (newWidth * (height / width)) | 0;
  } else if (height > MAX_HEIGHT && width > MAX_WIDTH) {
    newWidth = MAX_WIDTH;
    newHeight = MAX_HEIGHT;
  } else {
    return imageInfo.data;
  }

  const args = ['setup', width, height, newWidth, newHeight, 4, false];

  yield call(sendMessage, worker, args, false);

  const data = yield sendMessage(worker, ['resize', imageInfo.data]);

  return {
    data,
    width: newWidth,
    height: newHeight,
  };
}

function getUrlForImageData(data) {
  const canvas = document.createElement('canvas');
  [canvas.height, canvas.width] = data.shape;

  nj.images.save(data, canvas);

  return canvas.toDataURL('image/jpeg');
}

const createProcessMainImage = (workers) => function* processMainImage(action) {
  const [file] = action.payload;
  const buffer = yield call(readFile, file);

  const imageInfo = yield call(
    sendMessage,
    workers.decodeImage[0],
    buffer
  );

  const result = yield call(
    resizeMainImage,
    workers.resizeImage[0],
    imageInfo
  );

  console.log('result.data', result.data.length);
  const resizedData = nj.uint8(result.data).reshape(
    result.height,
    result.width,
    4
  );

  // let imageData = nj.uint8(imageInfo.data);
  // imageData = imageData.reshape(
  //   imageInfo.height,
  //   imageInfo.width,
  //   4
  // );

  // const resizedData = yield call(resizeMainImage, imageData);
  const url = yield call(getUrlForImageData, resizedData);

  const image = {
    url,
    data: resizedData,
  };

  yield put(actions.selectMainImage(image));
};

// function* applyMainImageCrop() {
//   const [mainImage, crop] = yield [
//     select(getMainImage),
//     select(getMainImageCrop),
//   ];

//   const imageData = mainImage.data;

//   const cropX = ((crop.x / 100) * data.shape[1]) | 0;
//   const cropY = ((crop.y / 100) * data.shape[0]) | 0;

//   const cropWidth = ((crop.width / 100) * data.shape[1]) | 0;
//   const cropHeight = ((crop.height / 100) * data.shape[0]) | 0;

//   const newImageData = imageData.slice();

//   // const canvas = document.createElement('canvas');
//   // canvas.width = cropWidth;
//   // canvas.height = cropHeight;

//   // const ctx = canvas.getContext('2d');

//   // ctx.drawImage()
// }

function* processTile(file) {
  const url = yield call(readFile, file);
  const data = yield call(getImageData, url);
  const resizedData = yield call(resizeTile, data);
  // const newUrl = yield call(getUrlForImageData, resizedData);

  return resizedData;

  // return {
  //   url: newUrl,
  //   data: resizedData,
  // };
}

function* processTiles(action) {
  const files = action.payload;

  let tiles = yield files.map(file => call(processTile, file));

  tiles = tiles.filter(({ shape: [,,channels] }) => channels === 3)

  yield put(actions.selectTiles(tiles));

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
}


function astype(array, dtype) {
  const clone = array.clone();
  clone.dtype = dtype;
  return clone;
}

const awiseSum = awise({
  initialize: function initialize() {
    return 1;
  },

  reduce: function reduce(p, x) {
    return p + x;
  },
});

function* generatePhotomosaic() {
  // eslint-disable-next-line prefer-const
  let [mainImage, tiles] = yield [
    select(getResizedCroppedMainImageData),
    select(getImageTilesData),
  ];

  // const mainImageCopy = mainImage.clone();
  mainImage = astype(mainImage, 'float32').selection;

  // tiles = ndarray(
  //   tiles.map(tile => astype(tile, 'float32').selection)
  // );

  const [height, width] = mainImage.shape;

  const diffs = nj.zeros([
    tiles.length,
    height / IMAGE_TILE_FACTOR,
    width / IMAGE_TILE_FACTOR,
  ]).selection;

  // const diffs = tiles.map(tile => {
  //   const selection = tileArray(tile.selection, [
  //     height / IMAGE_TILE_FACTOR,
  //     width / IMAGE_TILE_FACTOR,
  //   ]);

  //   const array = new nj.NdArray(selection);
  //   array.dtype = 'float32';

  //   return nj.abs(mainImage.subtract(array));
  // });

  // console.log('diffs done');

  // for (let i = 0; i < height; i += 10) {
  //   for (let j = 0; j < width; j += 10) {
  //   }
  // }

  console.log('loop done');

  // return mainImageCopy;
}

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    // [FINALIZE_MAIN_IMAGE_CROP]: applyMainImageCrop,
    [UPLOAD_TILES]: processTiles,
    // [SELECT_TILES]: generatePhotomosaic,
  });
}
