import { computeDiff } from '../lib/photomosaic';

self.onmessage = ({ data }) => {
  const [
    mainImageWidth,
    mainImageHeight,
    tileDimension,
    tileComparisonDimension,
    tileOutputDimension,
    mainImageBuffer,
    tileBuffer,
  ] = data;

  const diff = computeDiff({
    mainImageWidth,
    mainImageHeight,
    tileDimension,
    tileComparisonDimension,
    tileOutputDimension,
    mainImageBuffer,
    tileBuffer,
  });

  self.postMessage(diff);
};
