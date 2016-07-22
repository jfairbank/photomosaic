import { boundAtLargerDimension } from './utils';
import { computeDataURL, decode, resize } from './image';

export async function resizeAndComputeUrl(buffer, width, height, maxSize) {
  const {
    width: newWidth,
    height: newHeight,
  } = boundAtLargerDimension({
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

export async function processMainImage(rawBuffer, maxSize) {
  let width;
  let height;
  let buffer;

  try {
    ({ width, height, data: buffer } = await decode(rawBuffer));
  } catch (e) {
    throw new Error('Could not process main image. Please try another.');
  }

  return resizeAndComputeUrl(
    buffer,
    width,
    height,
    maxSize
  );
}
