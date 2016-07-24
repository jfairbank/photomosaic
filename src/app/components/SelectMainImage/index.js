import React, { PropTypes } from 'react';
import PageHeader from 'components/PageHeader';
import UploadFiles from 'components/UploadFiles';

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
        JPG or PNG images only.
      </UploadFiles>
    </div>
  );
}

SelectMainImage.propTypes = {
  onUploadMainImage: PropTypes.func.isRequired,
};
