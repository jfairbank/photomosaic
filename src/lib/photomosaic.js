import nj from 'numjs';
import tileArray from 'ndarray-tile';
import ops from 'ndarray-ops';

export function computeDiff({
  mainImageWidth,
  mainImageHeight,
  tileDimension,
  mainImageBuffer,
  tileBuffer,
}) {
  const heightScale = (mainImageHeight / tileDimension) | 0;
  const widthScale = (mainImageWidth / tileDimension) | 0;

  const mainImage = nj
    .float32(mainImageBuffer)
    .reshape(mainImageHeight, mainImageWidth, 4);

  const selection = tileArray(
    nj.ndarray(tileBuffer, [tileDimension, tileDimension, 4]),
    [heightScale, widthScale]
  );

  const tile = new nj.NdArray(selection);
  const diff = nj.abs(mainImage.subtract(tile));
  const diffReduced = nj.zeros([heightScale, widthScale], 'float32');

  for (let i = 0; i < mainImageHeight; i += tileDimension) {
    for (let j = 0; j < mainImageWidth; j += tileDimension) {
      const sum = diff.slice([i, i + tileDimension], [j, j + tileDimension]).sum();

      diffReduced.set(i / tileDimension, j / tileDimension, sum);
    }
  }

  return diffReduced.selection.data;
}

export function computePhotomosaic({
  width,
  height,
  tileDimension,
  mainImageBuffer,
  tileBuffers,
  diffBuffers,
}) {
  const numTiles = tileBuffers.length;
  const heightScale = (height / tileDimension) | 0;
  const widthScale = (width / tileDimension) | 0;

  const tiles = tileBuffers.map(tileBuffer => (
    nj.uint8(tileBuffer).reshape(tileDimension, tileDimension, 4)
  ));

  console.log('before mainImage');
  const mainImage = nj
    .float32(mainImageBuffer)
    .reshape(height, width, 4);
  console.log('after mainImage', mainImage.shape);

  console.log('before diffs');
  const diffs = nj.zeros([numTiles, heightScale, widthScale], 'float32');
  console.log('diffs zeros shape', diffs.shape);

  for (let i = 0; i < numTiles; i++) {
    const diff = nj.float32(diffBuffers[i]).reshape(1, heightScale, widthScale);

    // console.log(diffs.slice([i, i + 1]).shape);
    // console.log(diff.shape);

    diffs.slice([i, i + 1]).assign(diff, false);
  }

  mainImage.dtype = 'uint8';

  for (let i = 0; i < height; i += tileDimension) {
    for (let j = 0; j < width; j += tileDimension) {
      const si = i / tileDimension;
      const sj = j / tileDimension;
      const { selection } = diffs.slice(null, [si, si + 1], [sj, sj + 1]);
      const [tileIndex] = ops.argmin(selection);

      mainImage
        .slice([i, i + tileDimension], [j, j + tileDimension])
        .assign(tiles[tileIndex], false);
    }
  }

  return mainImage.selection.data;
}
