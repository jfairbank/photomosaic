/* eslint-disable object-shorthand,no-param-reassign */
import compact from 'lodash/compact';
import { takeEvery } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import download from 'downloadjs';
import * as actions from 'actions';
import * as fsm from 'fsm';

import {
  getFsmState,
  getMainImageCrop,
  getMainImageForProcessing,
  getMaxTileSize,
  getPhotomosaic,
  getTileSize,
  getTiles,
} from './selectors';

import {
  MAIN_IMAGE_MAX_SIZE,
  MAIN_IMAGE_MAX_SIZE_CROPPING,
} from './config';

import {
  CONFIRM_TILES,
  DOWNLOAD_PHOTOMOSAIC,
  SET_TILE_SIZE,
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
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
  const maxTileSize = yield select(getMaxTileSize);

  const response = yield call(
    workers.runTask,
    'processTile',
    [maxTileSize, buffer]
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

function* computePhotomosaicDiff(workers, mainImage, maxTileSize, tileSize, tileBuffer) {
  const message = [
    mainImage.width,
    mainImage.height,
    maxTileSize,
    tileSize.comparisonSize,
    tileSize.size,
    mainImage.buffer,
    tileBuffer,
  ];

  const result = yield call(
    workers.runTask,
    'computePhotomosaicDiff',
    message
  );

  return result;
}

function* computePhotomosaic(workers, mainImage, tileSize, buffers) {
  const [diffBuffers, tileBuffers] = buffers.reduce(
    (memo, buffer) => {
      memo[0].push(buffer.diffBuffer);
      memo[1].push(buffer.tileBuffer);
      return memo;
    },
    [[], []]
  );

  const message = [
    mainImage.width,
    mainImage.height,
    tileSize.comparisonSize,
    tileSize.size,
    tileBuffers,
    diffBuffers,
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
  const [
    tiles,
    mainImageForProcessing,
    mainImageCrop,
    tileSize,
    maxTileSize,
  ] = yield [
    select(getTiles),
    select(getMainImageForProcessing),
    select(getMainImageCrop),
    select(getTileSize),
    select(getMaxTileSize),
  ];

  const mainImage = yield call(getMainImageForPhotomosaic, workers, {
    mainImage: mainImageForProcessing,
    tileComparisonDimension: tileSize.comparisonSize,
    maxSize: MAIN_IMAGE_MAX_SIZE,
    crop: mainImageCrop,
  });

  const buffers = yield tiles.map(tile => (
    call(
      computePhotomosaicDiff,
      workers,
      mainImage,
      maxTileSize,
      tileSize,
      tile.buffer
    )
  ));

  const photomosaic = yield call(
    computePhotomosaic,
    workers,
    mainImage,
    tileSize,
    buffers
  );

  yield put(actions.setPhotomosaic(photomosaic));
};

function* downloadPhotomosaic() {
  const { fullUrl } = yield select(getPhotomosaic);
  yield call(download, fullUrl, 'photomosaic.jpg', 'image/jpeg');
}

function* recomputePhotomosaic(workers) {
  yield [
    put(actions.setFsmState(fsm.CREATING_PHOTOMOSAIC)),
    call(createGeneratePhotomosaic(workers)),
  ];
}

const createCheckRecomputePhotomosaic = (workers) =>
  function* checkRecomputePhotomosaic() {
    const fsmState = yield select(getFsmState);

    if (fsmState === fsm.DONE) {
      yield call(recomputePhotomosaic, workers);
    }
  };

export default function* mainSaga(workers) {
  yield* controller({
    [UPLOAD_MAIN_IMAGE]: createProcessMainImage(workers),
    [UPLOAD_TILES]: createProcessTiles(workers),
    [CONFIRM_TILES]: createGeneratePhotomosaic(workers),
    [DOWNLOAD_PHOTOMOSAIC]: downloadPhotomosaic,
    [SET_TILE_SIZE]: createCheckRecomputePhotomosaic(workers),
  });
}
