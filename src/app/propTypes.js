import { PropTypes } from 'react';

export const ImagePropType = PropTypes.shape({
  url: PropTypes.string,
  buffer: PropTypes.object,
});

export const ImageCropPropType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  aspect: PropTypes.number,
});
