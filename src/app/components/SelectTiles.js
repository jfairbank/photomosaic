import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import CroppedMainImage from '../containers/CroppedMainImage';

export default function SelectTiles({ onUploadTiles }) {
  return (
    <div>
      <CroppedMainImage />

      <Dropzone onDrop={onUploadTiles} multiple>
        <div>Upload tile images</div>
      </Dropzone>
    </div>
  );
}

SelectTiles.propTypes = {
  onUploadTiles: PropTypes.func.isRequired,
};
