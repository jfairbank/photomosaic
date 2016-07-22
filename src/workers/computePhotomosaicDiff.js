// import nj from 'numjs';
// import tileArray from 'ndarray-tile';
import { computeDiff } from '../lib/photomosaic';

// function computeDiff([
//   mainImageWidth,
//   mainImageHeight,
//   tileDimension,
//   mainImageBuffer,
//   tileBuffer,
// ]) {
//   const heightScale = (mainImageHeight / tileDimension) | 0;
//   const widthScale = (mainImageWidth / tileDimension) | 0;

//   const mainImage = nj
//     .float32(mainImageBuffer)
//     .reshape(mainImageHeight, mainImageWidth, 4);

//   const selection = tileArray(
//     nj.ndarray(tileBuffer, [tileDimension, tileDimension, 4]),
//     [heightScale, widthScale]
//   );

//   const tile = new nj.NdArray(selection);
//   const diff = nj.abs(mainImage.subtract(tile));
//   const diffReduced = nj.zeros([heightScale, widthScale], 'float32');

//   for (let i = 0; i < mainImageHeight; i += tileDimension) {
//     for (let j = 0; j < mainImageWidth; j += tileDimension) {
//       const sum = diff.slice([i, i + tileDimension], [j, j + tileDimension]).sum();

//       diffReduced.set(i / tileDimension, j / tileDimension, sum);
//     }
//   }

//   return diffReduced.selection.data;
// }

self.onmessage = ({ data }) => {
  const [
    mainImageWidth,
    mainImageHeight,
    tileDimension,
    mainImageBuffer,
    tileBuffer,
  ] = data;

  const diff = computeDiff({
    mainImageWidth,
    mainImageHeight,
    tileDimension,
    mainImageBuffer,
    tileBuffer,
  });

  self.postMessage(diff);
};
