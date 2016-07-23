import { createSelector } from 'reselect';
import * as fsm from 'fsm';

const PROGRESS_AMOUNT_MAP = {
  [fsm.SELECT_MAIN_IMAGE]: 0,
  [fsm.UPLOADING_MAIN_IMAGE]: 0,
  [fsm.CROP_MAIN_IMAGE]: 33,
  [fsm.SELECT_TILES]: 66,
  [fsm.CREATING_PHOTOMOSAIC]: 100,
  [fsm.DONE]: 100,
};

export function getFsmState(state) {
  return state.fsmState;
}

export const getProgressAmount = createSelector(
  [getFsmState],
  currentState => PROGRESS_AMOUNT_MAP[currentState]
);

export function getMainImageForProcessing(state) {
  return state.mainImageForProcessing;
}

export function getMainImageForCropping(state) {
  return state.mainImageForCropping;
}

export function getTiles(state) {
  return state.tiles;
}

export function isUploadingTiles(state) {
  return state.uploadingTiles;
}

export const getMainImageCrop = createSelector(
  state => state.mainImageCrop,
  mainImageCrop => ({ ...mainImageCrop, aspect: 1 })
);

export function getPhotomosaic(state) {
  return state.photomosaic;
}
