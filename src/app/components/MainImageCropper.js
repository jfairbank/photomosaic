import React, { PropTypes } from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import { ImagePropType, ImageCropPropType } from '../propTypes';

export default function MainImageCropper({
  mainImage,
  mainImageCrop,
  onUpdateCrop,
  onFinalizeCrop,
}) {
  return (
    <div>
      <h1>Crop your main image to a square</h1>

      <ButtonToolbar>
        <Button
          bsStyle="primary"
          bsSize="large"
          disabled={!mainImageCrop}
          onClick={onFinalizeCrop}
        >
          Done
        </Button>
      </ButtonToolbar>

      <ReactCrop
        src={mainImage.url}
        crop={mainImageCrop}
        onComplete={onUpdateCrop}
      />
    </div>
  );
}

MainImageCropper.propTypes = {
  mainImage: ImagePropType,
  mainImageCrop: ImageCropPropType,
  onUpdateCrop: PropTypes.func.isRequired,
  onFinalizeCrop: PropTypes.func.isRequired,
};
