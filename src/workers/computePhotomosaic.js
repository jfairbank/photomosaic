import { computePhotomosaic } from '../lib/photomosaic';

self.onmessage = ({ data }) => {
  const [
    width,
    height,
    tileComparisonDimension,
    tileDimension,
    tileBuffers,
    diffBuffers,
  ] = data;

  computePhotomosaic({
    width,
    height,
    tileComparisonDimension,
    tileDimension,
    tileBuffers,
    diffBuffers,
  }).then(
    photomosaic => self.postMessage(photomosaic)
  );
};
