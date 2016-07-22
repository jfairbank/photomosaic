import React, { PropTypes } from 'react';
// import classNames from 'classnames';
import { ButtonToolbar, Button, Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { ImagePropType } from '../../propTypes';
import styles from './styles.css';

export default function SelectTiles({
  haveTiles,
  tiles,
  uploadingTiles,
  onConfirmTiles,
  onUploadTiles,
}) {
  return (
    <div className={styles.selectTiles}>
      <ButtonToolbar>
        <Button onClick={onConfirmTiles}>
          Done
        </Button>
      </ButtonToolbar>

      <Dropzone onDrop={onUploadTiles} multiple>
        <div>Upload tile images</div>
      </Dropzone>

      {haveTiles &&
        <div>
          {tiles.map((tile, i) => (
            <Image key={i} src={tile.url} />
          ))}
        </div>
      }

      {uploadingTiles &&
        <div className={styles.overlay}>
          Uploading Tiles...
        </div>
      }
    </div>
  );
}

SelectTiles.propTypes = {
  haveTiles: PropTypes.bool,
  tiles: PropTypes.arrayOf(ImagePropType),
  uploadingTiles: PropTypes.bool,
  onConfirmTiles: PropTypes.func.isRequired,
  onUploadTiles: PropTypes.func.isRequired,
};
