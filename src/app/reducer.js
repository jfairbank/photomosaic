import * as fsm from 'fsm';

import {
  ADD_TILES,
  CONFIRM_MAIN_IMAGE_CROP,
  CONFIRM_TILES,
  RESTART,
  SELECT_MAIN_IMAGE,
  SET_MAIN_IMAGE_CROP,
  SET_PHOTOMOSAIC,
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
  INCREMENT_NUM_UPLOADED_TILES,
} from 'actionTypes';

const INITIAL_STATE = {
  mainImageForCropping: null,
  mainImageCrop: null,
  mainImageForProcessing: null,
  numTilesUploaded: 0,
  numTilesUploading: 0,
  tiles: [],
  uploadingTiles: false,
  fsmState: fsm.SELECT_MAIN_IMAGE,
};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_MAIN_IMAGE:
      return {
        ...state,
        fsmState: fsm.UPLOADING_MAIN_IMAGE,
      };

    case SELECT_MAIN_IMAGE: {
      const {
        mainImageForProcessing,
        mainImageForCropping,
        mainImageCrop,
      } = action.payload;

      return {
        ...state,
        mainImageForProcessing,
        mainImageForCropping,
        mainImageCrop,
        fsmState: fsm.CROP_MAIN_IMAGE,
      };
    }

    case SET_MAIN_IMAGE_CROP:
      return {
        ...state,
        mainImageCrop: action.payload,
      };

    case CONFIRM_MAIN_IMAGE_CROP:
      return {
        ...state,
        mainImageForCropping: null,
        fsmState: fsm.SELECT_TILES,
      };

    case UPLOAD_TILES:
      return {
        ...state,
        uploadingTiles: true,
        numTilesUploading: action.payload.length,
        numTilesUploaded: 0,
      };

    case INCREMENT_NUM_UPLOADED_TILES:
      return {
        ...state,
        numTilesUploaded: state.numTilesUploaded + 1,
      };

    case ADD_TILES:
      return {
        ...state,
        tiles: state.tiles.concat(action.payload),
        uploadingTiles: false,
      };

    case CONFIRM_TILES:
      return {
        ...state,
        fsmState: fsm.CREATING_PHOTOMOSAIC,
      };

    case SET_PHOTOMOSAIC:
      return {
        ...state,
        photomosaic: action.payload,
        mainImageForProcessing: null,
        fsmState: fsm.DONE,
      };

    case RESTART:
      return {
        ...INITIAL_STATE,
        tiles: state.tiles,
      };

    default:
      return state;
  }
}
