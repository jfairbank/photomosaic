import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ButtonToolbar, Button } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import { ImagePropType, ImageCropPropType } from '../propTypes';

function startedCrop(crop) {
  return (
    crop
    && crop.hasOwnProperty('x')
    && crop.hasOwnProperty('y')
    && crop.hasOwnProperty('width')
    && crop.hasOwnProperty('height')
  );
}

export default function MainImageCropper({
  mainImage,
  mainImageCrop,
  onUpdateCrop,
  onFinalizeCrop,
}) {
  return (
    <div>
      <Row>
        <Col xs="8">
          <ReactCrop
            src={mainImage.url}
            crop={mainImageCrop}
            onComplete={onUpdateCrop}
          />

          <h3>Crop your main image to a square</h3>

          <ButtonToolbar>
            <Button
              bsStyle="primary"
              bsSize="large"
              disabled={!startedCrop(mainImageCrop)}
              onClick={onFinalizeCrop}
            >
              Done
            </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    </div>
  );
}

MainImageCropper.propTypes = {
  mainImage: ImagePropType,
  mainImageCrop: ImageCropPropType,
  onUpdateCrop: PropTypes.func.isRequired,
  onFinalizeCrop: PropTypes.func.isRequired,
};
