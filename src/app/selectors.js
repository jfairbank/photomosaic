export function getMainImage(state) {
  return state.mainImage;
}

export function getMainImageForCropping(state) {
  return state.mainImageForCropping;
}

export function getTiles(state) {
  return state.tiles;
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
