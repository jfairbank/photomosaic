import * as fsm from './fsm';

import {
  UPLOAD_MAIN_IMAGE,
  SELECT_MAIN_IMAGE,
  SET_MAIN_IMAGE_CROP,
  FINALIZE_MAIN_IMAGE_CROP,
  SELECT_TILES,
} from './actionTypes';

const INITIAL_STATE = {
  mainImage: null,
  mainImageCrop: null,
  tiles: [],
  fsmState: fsm.SELECT_MAIN_IMAGE,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_MAIN_IMAGE:
      return {
        ...state,
        fsmState: fsm.UPLOADING_MAIN_IMAGE,
      };

    case SELECT_MAIN_IMAGE:
      return {
        ...state,
        mainImage: action.payload,
        fsmState: fsm.CROP_MAIN_IMAGE,
      };

    case SET_MAIN_IMAGE_CROP:
      return {
        ...state,
        mainImageCrop: action.payload,
      };

    case FINALIZE_MAIN_IMAGE_CROP:
      return {
        ...state,
        fsmState: fsm.SELECT_TILES,
      };

    case SELECT_TILES:
      return {
        ...state,
        tiles: action.payload,
        fsmState: fsm.CREATE_PHOTOMOSAIC,
      };

    default:
      return state;
  }
}
