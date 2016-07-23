import React, { PropTypes } from 'react';
import * as fsm from 'fsm';
import Processing from 'components/Processing';
import SelectMainImage from 'containers/SelectMainImage';
import MainImageCropper from 'containers/MainImageCropper';
import SelectTiles from 'containers/SelectTiles';
import Photomosaic from 'containers/Photomosaic';

export default function Flow({ fsmState }) {
  switch (fsmState) {
    case fsm.SELECT_MAIN_IMAGE:
      return <SelectMainImage />;

    case fsm.UPLOADING_MAIN_IMAGE:
      return (
        <Processing>
          Uploading Main Image...
        </Processing>
      );

    case fsm.CROP_MAIN_IMAGE:
      return <MainImageCropper />;

    case fsm.SELECT_TILES:
      return <SelectTiles />;

    case fsm.CREATING_PHOTOMOSAIC:
      return (
        <Processing>
          Generating Photomosaic...
          <br />
          <small>
            (Please wait as this may take a bit.)
          </small>
        </Processing>
      );

    default:
      return <Photomosaic />;
  }
}

Flow.propTypes = {
  fsmState: PropTypes.number.isRequired,
};
