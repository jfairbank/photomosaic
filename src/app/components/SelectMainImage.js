import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

export default function SelectMainImage({ onUploadMainImage }) {
  return (
    <div>
      <Dropzone onDrop={onUploadMainImage} multiple={false}>
        <div>Upload main image</div>
      </Dropzone>
    </div>
  );
}

SelectMainImage.propTypes = {
  onUploadMainImage: PropTypes.func.isRequired,
};
