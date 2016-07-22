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

  // let newWidth;
  // let newHeight;
  // if (width > height) {
  //   newHeight = tileDimension;
  //   newWidth = (newHeight * ratio) | 0;
  // } else if (height > width) {
  //   newWidth = tileDimension;
  //   newHeight = (newWidth / ratio) | 0;
  // } else {
  //   newWidth = tileDimension;
  //   newHeight = tileDimension;
  // }

  const resizedBuffer = resize(buffer, {
    width,
    height,
    newWidth,
    newHeight,
  });

  // const url = await computeDataURL(resizedBuffer, {
  //   width: newWidth,
  //   height: newHeight,
  // });

  // console.log('tileDimension', tileDimension);
  // console.log('width', width);
  // console.log('height', height);
  // console.log('newWidth', newWidth);
  // console.log('newHeight', newHeight);
  const {
    dimension,
    buffer: croppedBuffer,
  } = cropSquareFromCenter(resizedBuffer, newWidth, newHeight);

  // console.log('dimension', dimension);
  // console.log('buffer', croppedBuffer.length);

  const url = await computeDataURL(croppedBuffer, {
    width: dimension,
    height: dimension,
  });

  return {
    url,
    buffer: croppedBuffer,
    // buffer: resizedBuffer,
  };
}
