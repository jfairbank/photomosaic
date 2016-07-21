import React, { PropTypes } from 'react';

export default function Photomosaic({ url }) {
  return (
    <div>
      <img
        role="presentation"
        src={url}
        width="100%"
      />
    </div>
  );
}

Photomosaic.propTypes = {
  url: PropTypes.string.isRequired,
};
