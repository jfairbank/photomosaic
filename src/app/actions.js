import {
  ADD_TILES,
  CONFIRM_MAIN_IMAGE_CROP,
  CONFIRM_TILES,
  DOWNLOAD_PHOTOMOSAIC,
  INCREMENT_NUM_UPLOADED_TILES,
  RESTART,
  SELECT_MAIN_IMAGE,
  SET_MAIN_IMAGE_CROP,
  SET_PHOTOMOSAIC,
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
} from './actionTypes';

export const uploadMainImage = (file) => ({
  type: UPLOAD_MAIN_IMAGE,
  payload: file,
});

export const selectMainImage = (url) => ({
  type: SELECT_MAIN_IMAGE,
  payload: url,
});

export const setMainImageCrop = (crop) => ({
  type: SET_MAIN_IMAGE_CROP,
  payload: crop,
});

export const confirmMainImageCrop = () => ({
  type: CONFIRM_MAIN_IMAGE_CROP,
});

export const uploadTiles = (tiles) => ({
  type: UPLOAD_TILES,
  payload: tiles,
});

export const incrementNumUploadedTiles = () => ({
  type: INCREMENT_NUM_UPLOADED_TILES,
});

export const addTiles = (tiles) => ({
  type: ADD_TILES,
  payload: tiles,
});

export const confirmTiles = () => ({
  type: CONFIRM_TILES,
});

export const setPhotomosaic = (photomosaic) => ({
  type: SET_PHOTOMOSAIC,
  payload: photomosaic,
});

export const downloadPhotomosaic = () => ({
  type: DOWNLOAD_PHOTOMOSAIC,
});

export const restart = () => ({
  type: RESTART,
});
