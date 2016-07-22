import {
  UPLOAD_MAIN_IMAGE,
  SELECT_MAIN_IMAGE,
  SET_MAIN_IMAGE_CROP,
  CONFIRM_MAIN_IMAGE_CROP,
  UPLOAD_TILES,
  ADD_TILES,
  CONFIRM_TILES,
  SET_PHOTOMOSAIC,
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
