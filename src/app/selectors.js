/* eslint-disable no-param-reassign,object-shorthand */
import { createSelector } from 'reselect';
import nj from 'numjs';
import { IMAGE_TILE_FACTOR } from './config';
import { resize } from './utils';
// import ndarray from 'ndarray';
import tileArray from 'ndarray-tile';
// import cwise from 'cwise';

export function astype(array, dtype) {
  const clone = array.clone();
  clone.dtype = dtype;
  return clone;
}

export function getMainImage(state) {
  return state.mainImage;
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

export const getImageTilesData = createSelector(
  [getTiles],

  // tiles => tiles.map(tile => tile.data)
  tiles => tiles
);

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

export const getResizedCroppedMainImageData = createSelector(
  [getCroppedMainImageData],

  data => {
    const [height] = data.shape;
    const newDimension = height - (height % IMAGE_TILE_FACTOR);

    return resize(data, newDimension, newDimension);
  }
);

// export const createPhotomosaic = cwise({
//   args: ['array', 'array'],

//   pre: function preCreatePhotomosaic() {
//     // this.photomosaic = mainImage.clone();
//   },

//   body: function createPhotomosaic(mainImage, tiles) {
//     console.log('yolo');
//   },

//   post: function postCreatePhotomosaic() {
//     return this.photomosaic;
//   },
// });

export const getPhotoMosaicData = createSelector(
  [getResizedCroppedMainImageData, getImageTilesData],

  (mainImage, tiles) => {
    if (!mainImage || tiles.length <= 0) {
      return null;
    }

    const mainImageCopy = mainImage.clone();
    mainImage = astype(mainImage, 'float32');
    tiles = tiles.map(tile => astype(tile, 'float32'));


    // tiles = ndarray(
    //   tiles.map(tile => astype(tile, 'float32').selection)
    // );

    const [height, width] = mainImage.shape;

    // createPhotomosaic(mainImage, tiles);

    console.time('diffs');
    let diffs = tiles.map(tile => {
      const selection = tileArray(tile.selection, [
        height / IMAGE_TILE_FACTOR,
        width / IMAGE_TILE_FACTOR,
      ]);

      const array = new nj.NdArray(selection);
      array.dtype = 'float32';

      return nj.abs(mainImage.subtract(array));
    });
    console.timeEnd('diffs');

    // for (let i = 0; i < height; i += IMAGE_TILE_FACTOR) {
    //   for (let j = 0; j < width; j += IMAGE_TILE_FACTOR) {
    //     const slice = mainImage
    //       .slice([i, i + IMAGE_TILE_FACTOR], [j, j + IMAGE_TILE_FACTOR]);

    //     let minDiff;
    //     let minTile;

    //     for (let k = 0, l = tiles.length; k < l; k++) {
    //       const tile = tiles[k];
    //       const diff = nj.abs(slice.subtract(tile)).sum();

    //       if (!minTile && tile.shape[2] === 3) {
    //         minTile = tile;
    //         minDiff = diff;
    //       } else if (diff < minDiff && tile.shape[2] === 3) {
    //         minTile = tile;
    //         minDiff = diff;
    //       }
    //     }

    //     try {
    //       mainImageCopy
    //         .slice([i, i + IMAGE_TILE_FACTOR], [j, j + IMAGE_TILE_FACTOR])
    //         .assign(minTile, false);
    //     } catch (e) {
    //       console.log(
    //         mainImageCopy
    //           .slice([i, i + IMAGE_TILE_FACTOR], [j, j + IMAGE_TILE_FACTOR])
    //           .shape
    //       );

    //       console.log(minTile.shape);

    //       throw new Error('woops!');
    //     }
    //   }
    // }

    return mainImageCopy;
  }
);
