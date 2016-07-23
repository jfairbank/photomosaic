import nj from 'numjs';
import tileArray from 'ndarray-tile';
import ops from 'ndarray-ops';
import { resize, computeDataURL } from '../lib/image';

export function computeDiff({
  mainImageWidth,
  mainImageHeight,
  tileComparisonDimension,
  tileDimension,
  mainImageBuffer,
  tileBuffer,
}) {
  const comparisonTileBuffer = resize(tileBuffer, {
    width: tileDimension,
    height: tileDimension,
    newWidth: tileComparisonDimension,
    newHeight: tileComparisonDimension,
  });

  const heightScale = (mainImageHeight / tileComparisonDimension) | 0;
  const widthScale = (mainImageWidth / tileComparisonDimension) | 0;

  const mainImage = nj
    .float32(mainImageBuffer)
    .reshape(mainImageHeight, mainImageWidth, 4);

  const selection = tileArray(
    nj.ndarray(
      comparisonTileBuffer,
      [tileComparisonDimension, tileComparisonDimension, 4]
    ),

    [heightScale, widthScale]
  );

  const tile = new nj.NdArray(selection);
  // const diff = nj.abs(mainImage.subtract(tile));
  const diff = nj.power(mainImage.subtract(tile), 2);
  const diffReduced = nj.zeros([heightScale, widthScale], 'float32');

  for (let i = 0; i < mainImageHeight; i += tileComparisonDimension) {
    for (let j = 0; j < mainImageWidth; j += tileComparisonDimension) {
      const sum = diff.slice(
        [i, i + tileComparisonDimension],
        [j, j + tileComparisonDimension]
      ).sum();

      diffReduced.set(
        i / tileComparisonDimension,
        j / tileComparisonDimension,
        // sum
        Math.sqrt(sum)
      );
    }
  }

  return diffReduced.selection.data;
}

export async function computePhotomosaic({
  width,
  height,
  tileComparisonDimension,
  tileDimension,
  tileBuffers,
  diffBuffers,
}) {
  const tileScale = tileDimension / tileComparisonDimension;
  const numTiles = tileBuffers.length;
  const heightScale = (height / tileComparisonDimension) | 0;
  const widthScale = (width / tileComparisonDimension) | 0;

  const tiles = tileBuffers.map(tileBuffer => (
    nj.uint8(tileBuffer).reshape(tileDimension, tileDimension, 4)
  ));

  const photomosaic = nj.zeros(
    [height * tileScale, width * tileScale, 4],
    'uint8'
  );

  const diffs = nj.zeros([numTiles, heightScale, widthScale], 'float32');

  for (let i = 0; i < numTiles; i++) {
    const diff = nj.float32(diffBuffers[i]).reshape(1, heightScale, widthScale);
    diffs.slice([i, i + 1]).assign(diff, false);
  }

  for (let i = 0; i < height; i += tileComparisonDimension) {
    for (let j = 0; j < width; j += tileComparisonDimension) {
      const si = i / tileComparisonDimension;
      const sj = j / tileComparisonDimension;
      const { selection } = diffs.slice(null, [si, si + 1], [sj, sj + 1]);
      const [tileIndex] = ops.argmin(selection);

      const scaledPhotomosaicI = i * tileScale;
      const scaledPhotomosaicJ = j * tileScale;

      photomosaic
        .slice(
          [scaledPhotomosaicI, scaledPhotomosaicI + tileDimension],
          [scaledPhotomosaicJ, scaledPhotomosaicJ + tileDimension]
        )
        .assign(tiles[tileIndex], false);
    }
  }

  const fullUrl = await computeDataURL(photomosaic.selection.data, {
    width: photomosaic.shape[1],
    height: photomosaic.shape[0],
    quality: 75,
  });

  const displayDimension = 500;

  const displayPhotomosaic = resize(photomosaic.selection.data, {
    width: photomosaic.shape[1],
    height: photomosaic.shape[0],
    newWidth: displayDimension,
    newHeight: displayDimension,
  });

  const displayUrl = await computeDataURL(displayPhotomosaic, {
    width: displayDimension,
    height: displayDimension,
    quality: 60,
  });

  return { fullUrl, displayUrl };
}
