import nj from 'numjs';
import ops from 'ndarray-ops';

self.onmessage = ({ data }) => {
  const [
    width,
    height,
    tileDimension,
    mainImageBuffer,
    tileBuffers,
    diffBuffers,
  ] = data;

  const numTiles = tileBuffers.length;
  const heightScale = (height / tileDimension) | 0;
  const widthScale = (width / tileDimension) | 0;

  const tiles = tileBuffers.map(tileBuffer => (
    nj.uint8(tileBuffer).reshape(tileDimension, tileDimension, 4)
  ));

  // console.log('before mainImage');
  const mainImage = nj
    .float32(mainImageBuffer)
    .reshape(height, width, 4);
  // console.log('after mainImage', mainImage.shape);

  // console.log('before diffs');
  const diffs = nj.zeros([numTiles, heightScale, widthScale], 'float32');
  // console.log('diffs zeros shape', diffs.shape);

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

  self.postMessage(mainImage.selection.data);
};
