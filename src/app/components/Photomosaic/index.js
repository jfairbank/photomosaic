import React, { PropTypes } from 'react';
import PageHeader from 'components/PageHeader';
import BigButton from 'components/BigButton';
import styles from './styles.css';

import {
  Button,
  ButtonGroup,
  Image,
} from 'react-bootstrap';

export default function Photomosaic({
  url,
  tileSize,
  onDownloadFull,
  onRestart,
  onSetXsmallTileSize,
  onSetSmallTileSize,
  onSetMediumTileSize,
  onSetLargeTileSize,
}) {
  return (
    <div className={styles.photomosaic}>
      <PageHeader>
        Here's your photomosaic!
      </PageHeader>

      <BigButton onClick={onDownloadFull}>
        Download Hi-Res Photomosaic
      </BigButton>

      <div className={styles.changeTileSize}>
        <h3>Change Tile Size</h3>

        <ButtonGroup bsSize="large">
          <Button
            disabled={tileSize === 'xsmall'}
            onClick={onSetXsmallTileSize}
          >
            XSmall
          </Button>

          <Button
            disabled={tileSize === 'small'}
            onClick={onSetSmallTileSize}
          >
            Small
          </Button>

          <Button
            disabled={tileSize === 'medium'}
            onClick={onSetMediumTileSize}
          >
            Medium
          </Button>

          <Button
            disabled={tileSize === 'large'}
            onClick={onSetLargeTileSize}
          >
            Large
          </Button>
        </ButtonGroup>
      </div>

      <div className={styles.preview}>
        <Image src={url} />
      </div>

      <Button
        className={styles.restartLink}
        bsStyle="link"
        onClick={onRestart}
      >
        Create Another Photomosaic
      </Button>
    </div>
  );
}

Photomosaic.propTypes = {
  url: PropTypes.string.isRequired,
  tileSize: PropTypes.string.isRequired,
  onDownloadFull: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  onSetXsmallTileSize: PropTypes.func.isRequired,
  onSetSmallTileSize: PropTypes.func.isRequired,
  onSetMediumTileSize: PropTypes.func.isRequired,
  onSetLargeTileSize: PropTypes.func.isRequired,
};
