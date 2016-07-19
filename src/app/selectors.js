import { createSelector } from 'reselect';

export function getMainImage(state) {
  return state.mainImage;
}

export function getMainImageCrop(state) {
  return {
    ...state.mainImageCrop,
    aspect: 1,
  };
}

export const getCroppedMainImageData = createSelector(
  [getMainImage, getMainImageCrop],

  (mainImage, crop) => {
    const imageData = mainImage.data;

    const x = ((crop.x / 100) * imageData.shape[1]) | 0;
    const y = ((crop.y / 100) * imageData.shape[0]) | 0;

    const width = ((crop.width / 100) * imageData.shape[1]) | 0;
    const height = ((crop.height / 100) * imageData.shape[0]) | 0;

    return imageData.slice(
      [y, y + height],
      [x, x + width]
    );
  }
);
