import { getMainImageForPhotomosaic } from '../lib/photomosaic';

self.onmessage = ({ data }) => {
  const [
    width,
    height,
    tileComparisonDimension,
    maxSize,
    crop,
    buffer,
  ] = data;

  self.postMessage(getMainImageForPhotomosaic({
    buffer,
    width,
    height,
    tileComparisonDimension,
    crop,
    maxSize,
  }));
};
