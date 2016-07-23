import { boundAtSmallerDimension } from './utils';

import {
  computeDataURL,
  cropSquareFromCenter,
  decode,
  resize,
} from './image';

export async function processTile(rawBuffer, tileDimension) {
  let width;
  let height;
  let buffer;

  try {
    ({ width, height, data: buffer } = await decode(rawBuffer));
  } catch (e) {
    throw new Error('Could not process tile.');
  }

  const {
    width: newWidth,
    height: newHeight,
  } = boundAtSmallerDimension({
    width,
    height,
    maxWidth: tileDimension,
    maxHeight: tileDimension,
  });

  const resizedBuffer = resize(buffer, {
    width,
    height,
    newWidth,
    newHeight,
  });

  const {
    dimension,
    buffer: croppedBuffer,
  } = cropSquareFromCenter(resizedBuffer, newWidth, newHeight);

  const url = await computeDataURL(croppedBuffer, {
    width: dimension,
    height: dimension,
  });

  return {
    url,
    buffer: croppedBuffer,
  };
}
