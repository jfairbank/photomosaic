import React, { PropTypes } from 'react';
import * as fsm from '../fsm';
import SelectMainImage from '../containers/SelectMainImage';
import MainImageCropper from '../containers/MainImageCropper';
import SelectTiles from '../containers/SelectTiles';
import Photomosaic from '../containers/Photomosaic';

export default function Flow({ fsmState }) {
  switch (fsmState) {
    case fsm.SELECT_MAIN_IMAGE:
      return <SelectMainImage />;

    case fsm.UPLOADING_MAIN_IMAGE:
      return (
        <h3>Uploading Main Image...</h3>
      );

    case fsm.CROP_MAIN_IMAGE:
      return <MainImageCropper />;

    case fsm.SELECT_TILES:
      return <SelectTiles />;

    default:
      return <Photomosaic />;
  }
}

Flow.propTypes = {
  fsmState: PropTypes.number.isRequired,
};
