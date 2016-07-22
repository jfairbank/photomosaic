export function boundAtSmallerDimension({ width, height, maxWidth, maxHeight }) {
  if (height < width && height > maxHeight) {
    return {
      width: (maxHeight * (width / height)) | 0,
      height: maxHeight,
    };
  }

  if (width < height && width > maxWidth) {
    return {
      width: maxWidth,
      height: (maxWidth * (height / width)) | 0,
    };
  }

  if (height > maxHeight && width > maxWidth) {
    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  return { width, height };
}

export function boundAtLargerDimension({ width, height, maxWidth, maxHeight }) {
  if (height > width && height > maxHeight) {
    return {
      width: (maxHeight * (width / height)) | 0,
      height: maxHeight,
    };
  }

  if (width > height && width > maxWidth) {
    return {
      width: maxWidth,
      height: (maxWidth * (height / width)) | 0,
    };
  }

  if (height > maxHeight && width > maxWidth) {
    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  return { width, height };
}
