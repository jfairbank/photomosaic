import {
  UPLOAD_MAIN_IMAGE,
  SELECT_MAIN_IMAGE,
  SET_MAIN_IMAGE_CROP,
  FINALIZE_MAIN_IMAGE_CROP,
  // APPLY_MAIN_IMAGE_CROP,
  UPLOAD_TILES,
  SELECT_TILES,
} from './actionTypes';

export const uploadMainImage = file => ({ type: UPLOAD_MAIN_IMAGE, payload: file });
export const selectMainImage = url => ({ type: SELECT_MAIN_IMAGE, payload: url });
export const setMainImageCrop = crop => ({ type: SET_MAIN_IMAGE_CROP, payload: crop });
export const finalizeMainImageCrop = () => ({ type: FINALIZE_MAIN_IMAGE_CROP });
// export const applyMainImageCrop = image => ({ type: APPLY_MAIN_IMAGE_CROP, payload: image });
export const uploadTiles = files => ({ type: UPLOAD_TILES, payload: files });
export const selectTiles = urls => ({ type: SELECT_TILES, payload: urls });
