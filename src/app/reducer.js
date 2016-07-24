import * as fsm from 'fsm';
import { TILE_SIZES } from 'config';

import {
  ADD_TILES,
  CONFIRM_MAIN_IMAGE_CROP,
  CONFIRM_TILES,
  INCREMENT_NUM_UPLOADED_TILES,
  REMOVE_ALL_ICONS,
  REMOVE_ICON,
  RESTART,
  SELECT_MAIN_IMAGE,
  SET_FSM_STATE,
  SET_MAIN_IMAGE_CROP,
  SET_PHOTOMOSAIC,
  SET_TILE_SIZE,
  UPLOAD_MAIN_IMAGE,
  UPLOAD_TILES,
} from 'actionTypes';

const INITIAL_STATE = {
  mainImageForCropping: null,
  mainImageCrop: null,
  mainImageForProcessing: null,
  numTilesUploaded: 0,
  numTilesUploading: 0,
  tiles: [],
  maxTileSize: TILE_SIZES.large.size,
  tileSize: 'medium',
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
        fsmState: fsm.DONE,
      };

    case SET_TILE_SIZE:
      return {
        ...state,
        tileSize: action.payload,
      };

    case RESTART:
      return {
        ...INITIAL_STATE,
        tiles: state.tiles,
      };

    case SET_FSM_STATE:
      return {
        ...state,
        fsmState: action.payload,
      };

    case REMOVE_ICON: {
      const id = action.payload;

      return {
        ...state,
        tiles: state.tiles.filter((_, i) => i !== id),
      };
    }

    case REMOVE_ALL_ICONS:
      return {
        ...state,
        tiles: [],
      };

    default:
      return state;
  }
}
