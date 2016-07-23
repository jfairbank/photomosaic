import { createSelector } from 'reselect';
import * as fsm from 'fsm';

const PROGRESS_AMOUNT_MAP = {
  [fsm.SELECT_MAIN_IMAGE]: 0,
  [fsm.UPLOADING_MAIN_IMAGE]: 0,
  [fsm.CROP_MAIN_IMAGE]: 33,
  [fsm.SELECT_TILES]: 66,
  [fsm.CREATING_PHOTOMOSAIC]: 66,
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
  getMainImageForCropping,

  (mainImageCrop, { width, height }) => {
    if (mainImageCrop) {
      return { ...mainImageCrop, aspect: 1 };
    }

    const minDimension = Math.min(width, height);
    const initialWidth = minDimension * 0.75;
    const initialWidthPercentage = ((initialWidth / width) * 100) | 0;

    const initialX = (width - initialWidth) / 2;
    const initialY = (height - initialWidth) / 2;

    const initialXPercentage = ((initialX / width) * 100) | 0;
    const initialYPercentage = ((initialY / height) * 100) | 0;

    // if (width > height) {
    // }

    // const initialSize = 50;
    // const initialX = (width);
    // const initialY = 25;

    return {
      x: initialXPercentage,
      y: initialYPercentage,
      width: initialWidthPercentage,
      ...mainImageCrop,
      aspect: 1,
    };
  }
);

export function getPhotomosaic(state) {
  return state.photomosaic;
}
