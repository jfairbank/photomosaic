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

export function getMainImageCrop(state) {
  return {
    ...state.mainImageCrop,
    aspect: 1,
  };
}

export function getPhotomosaic(state) {
  return state.photomosaic;
}
