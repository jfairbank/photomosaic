import nj from 'numjs';

export function removeAlphaChannel(image) {
  return image.slice(0, 0, [0, 3]);
}

export function resize(image, height, width) {
  return removeAlphaChannel(nj.images.resize(image, height, width));
}
