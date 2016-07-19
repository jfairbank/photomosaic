import { PropTypes } from 'react';

export const ImagePropType = PropTypes.shape({
  url: PropTypes.string,
  // data: PropTypes.instanceOf(nj),
  data: PropTypes.object,
});

export const ImageCropPropType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  aspect: PropTypes.number,
});

export const CroppedCoordsPropType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
});
