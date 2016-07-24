import { boundAtSmallerDimension } from './utils';
import { computeDataURL, decode, resize } from './image';

export async function resizeAndComputeUrl(buffer, width, height, maxSize) {
  const {
    width: newWidth,
    height: newHeight,
  } = boundAtSmallerDimension({
    width,
    height,
    maxWidth: maxSize,
    maxHeight: maxSize,
  });

  const resizedBuffer = resize(buffer, {
    width,
    height,
    newWidth,
    newHeight,
  });

  const url = await computeDataURL(resizedBuffer, {
    width: newWidth,
    height: newHeight,
  });

  return {
    url,
    width: newWidth,
    height: newHeight,
    buffer: resizedBuffer,
  };
}

export async function processMainImage(buffer, { width, height, maxSize }) {
  return resizeAndComputeUrl(
    buffer,
    width,
    height,
    maxSize
  );
}
