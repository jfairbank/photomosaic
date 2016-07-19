import { takeEvery } from 'redux-saga';
// import { call, put, select } from 'redux-saga/effects';
import { call, put } from 'redux-saga/effects';
import nj from 'numjs';
import * as actions from './actions';
// import { getMainImage, getMainImageCrop } from './selectors';

import {
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  // FINALIZE_MAIN_IMAGE_CROP,
} from './actionTypes';

function identity(value) {
  return value;
}

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
    reader.readAsDataURL(file);
  });
}

function getImageData(url) {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => resolve(nj.images.read(img));
    img.src = url;
  });
}

function resizeTile(image) {
  const newData = nj.images.resize(image.data, 50, 50);

  return {
    url: image.url,
    data: newData,
  };
}

function resizeMainImage(data) {
  const MAX_WIDTH = 1000;
  const MAX_HEIGHT = 1000;
  const [height, width] = data.shape;

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
    newHeight = height;
    newWidth = width;
  }

  return nj.images.resize(data, newHeight, newWidth);
}

function getUrlForImageData(data) {
  const canvas = document.createElement('canvas');
  [canvas.height, canvas.width] = data.shape;

  nj.images.save(data, canvas);

  return canvas.toDataURL('image/jpeg');
}

function* processImage(file, additionalProcessor = identity) {
  const url = yield call(readFile, file);
  const data = yield call(getImageData, url);
  const image = yield call(additionalProcessor, { url, data });

  return image;
}

const createProcessMainImage = (workers) => function* processMainImage(action) {
  const [file] = action.payload;
  // const image = yield call(processImage, file);
  const url = yield call(readFile, file);
  const data = yield call(getImageData, url);
  const resizedData = yield call(resizeMainImage, data);
  const newUrl = yield call(getUrlForImageData, resizedData);

  const newImage = {
    url: newUrl,
    data: resizedData,
  };

  yield put(actions.selectMainImage(newImage));
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

function* processTiles(action) {
  const files = action.payload;

  const tiles = yield files.map(
    file => call(processImage, file, resizeTile)
  );

  window.tiles = tiles;

  yield put(actions.selectTiles(tiles));
}

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    // [FINALIZE_MAIN_IMAGE_CROP]: applyMainImageCrop,
    [UPLOAD_TILES]: processTiles,
  });
}
