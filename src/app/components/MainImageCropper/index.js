import React, { PropTypes } from 'react';
import ReactCrop from 'react-image-crop';
import PageHeader from 'components/PageHeader';
import BigButton from 'components/BigButton';
import { ImagePropType, ImageCropPropType } from 'propTypes';
import styles from './styles.css';

export default function MainImageCropper({
  mainImage,
  mainImageCrop,
  onUpdateCrop,
  onConfirmCrop,
}) {
  return (
    <div className={styles.mainImageCropper}>
      <PageHeader>
        Next, crop your main image to a square.
      </PageHeader>

      <BigButton onClick={onConfirmCrop}>
        Done Cropping
      </BigButton>

      <div className={styles.cropContainer}>
        <ReactCrop
          src={mainImage.url}
          crop={mainImageCrop}
          onComplete={onUpdateCrop}
          keepSelection
        />
      </div>
    </div>
  );
}

MainImageCropper.propTypes = {
  mainImage: ImagePropType,
  mainImageCrop: ImageCropPropType,
  onUpdateCrop: PropTypes.func.isRequired,
  onConfirmCrop: PropTypes.func.isRequired,
};
