import React, { PropTypes } from 'react';
import PageHeader from './PageHeader';
import UploadFiles from './UploadFiles';

export default function SelectMainImage({ onUploadMainImage }) {
  return (
    <div>
      <PageHeader>
        <p>
          Create a photomosaic!
        </p>

        <p>
          First, select your main big image.
        </p>
      </PageHeader>

      <UploadFiles onUpload={onUploadMainImage} multiple={false}>
        Drag and drop or click to upload an image.
        <br />
        Must be a JPEG image.
      </UploadFiles>
    </div>
  );
}

SelectMainImage.propTypes = {
  onUploadMainImage: PropTypes.func.isRequired,
};
