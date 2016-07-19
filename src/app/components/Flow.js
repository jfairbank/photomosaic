import React, { PropTypes } from 'react';
import { ImagePropType } from '../propTypes';
import * as fsm from '../fsm';
import SelectMainImage from '../containers/SelectMainImage';
import MainImageCropper from '../containers/MainImageCropper';
import SelectTiles from '../containers/SelectTiles';

export default function Flow({
  mainImage,
  tiles,
  fsmState,
}) {
  switch (fsmState) {
    case fsm.SELECT_MAIN_IMAGE:
      return <SelectMainImage />;

    case fsm.CROP_MAIN_IMAGE:
      return <MainImageCropper />;

    case fsm.SELECT_TILES:
      return <SelectTiles />;

    default:
      return (
        <div>
          <img role="presentation" width="200" src={mainImage.url} />
          <br />
          {tiles.map((tile, i) => (
            <img
              key={i}
              role="presentation"
              height="50"
              width="50"
              src={tile.url}
            />
          ))}
        </div>
      );
  }
}

Flow.propTypes = {
  mainImage: ImagePropType,
  tiles: PropTypes.arrayOf(ImagePropType),
  fsmState: PropTypes.number.isRequired,
};
