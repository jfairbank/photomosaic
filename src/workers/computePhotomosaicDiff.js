import { computeDiff } from '../lib/photomosaic';

self.onmessage = ({ data }) => {
  const [
    mainImageWidth,
    mainImageHeight,
    tileComparisonDimension,
    tileDimension,
    mainImageBuffer,
    tileBuffer,
  ] = data;

  const diff = computeDiff({
    mainImageWidth,
    mainImageHeight,
    tileComparisonDimension,
    tileDimension,
    mainImageBuffer,
    tileBuffer,
  });

  self.postMessage(diff);
};
