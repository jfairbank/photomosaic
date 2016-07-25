import React, { PropTypes } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import classNames from 'classnames';
import * as fsm from 'fsm';
import styles from './styles.css';

function activeNavButtonClass(currentFsmState, fsmState) {
  return classNames({
    [styles.activeNavButton]: currentFsmState >= fsmState,
  });
}

export default function Progress({
  fsmState,
  showOverlay,
  canSelectMainImage,
  canCropMainImage,
  canSelectTiles,
  canViewPhotomosaic,
  onSelectMainImage,
  onCropMainImage,
  onSelectTiles,
  onViewPhotomosaic,
}) {
  return (
    <div className={styles.progress}>
      <ButtonGroup
        className={styles.nav}
        justified
      >
        <Button
          className={activeNavButtonClass(fsmState, fsm.SELECT_MAIN_IMAGE)}
          disabled={!canSelectMainImage}
          onClick={onSelectMainImage}
          href="#"
        >
          1. Select Main Image
        </Button>

        <Button
          className={activeNavButtonClass(fsmState, fsm.CROP_MAIN_IMAGE)}
          disabled={!canCropMainImage}
          onClick={onCropMainImage}
          href="#"
        >
          2. Crop Main Image
        </Button>

        <Button
          className={activeNavButtonClass(fsmState, fsm.SELECT_TILES)}
          disabled={!canSelectTiles}
          onClick={onSelectTiles}
          href="#"
        >
          3. Select Tiles
        </Button>

        <Button
          className={activeNavButtonClass(fsmState, fsm.DONE)}
          disabled={!canViewPhotomosaic}
          onClick={onViewPhotomosaic}
          href="#"
        >
          4. View Photomosaic
        </Button>
      </ButtonGroup>

      <div
        className={classNames(
          styles.overlay,
          { [styles.overlayShow]: showOverlay }
        )}
      />
    </div>
  );
}

Progress.propTypes = {
  amount: PropTypes.number.isRequired,
  fsmState: PropTypes.number.isRequired,
  showOverlay: PropTypes.bool.isRequired,
  canSelectMainImage: PropTypes.bool.isRequired,
  canCropMainImage: PropTypes.bool.isRequired,
  canSelectTiles: PropTypes.bool.isRequired,
  canViewPhotomosaic: PropTypes.bool.isRequired,
  onSelectMainImage: PropTypes.func.isRequired,
  onCropMainImage: PropTypes.func.isRequired,
  onSelectTiles: PropTypes.func.isRequired,
  onViewPhotomosaic: PropTypes.func.isRequired,
};
