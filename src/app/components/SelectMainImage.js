import React, { PropTypes } from 'react';
import Page from './Page';
import PageHeader from './PageHeader';
import UploadFiles from './UploadFiles';

export default function SelectMainImage({ onUploadMainImage }) {
  return (
    <Page>
      <PageHeader>
        Create a photomosaic!
        <br />
        First, select your main big image.
      </PageHeader>

      <UploadFiles onUpload={onUploadMainImage} multiple={false}>
        Drag and drop or click to upload an image.
        <br />
        Must be a JPEG image.
      </UploadFiles>
    </Page>
  );
}

SelectMainImage.propTypes = {
  onUploadMainImage: PropTypes.func.isRequired,
};
