import React, { PropTypes } from 'react';
import classNames from 'classnames';
import PageHeader from 'components/PageHeader';
import BigButton from 'components/BigButton';
import UploadFiles from 'components/UploadFiles';
import Processing from 'components/Processing';
import SelectedTiles from 'containers/SelectedTiles';
import styles from './styles.css';

export default function SelectTiles({
  haveTiles,
  uploadingTiles,
  numTilesUploaded,
  numTilesUploading,
  percentTilesUploaded,
  onConfirmTiles,
  onUploadTiles,
}) {
  const overlayClassName = classNames(
    styles.overlay,
    { [styles.overlayUploading]: uploadingTiles }
  );

  return (
    <div className={styles.selectTiles}>
      <PageHeader>
        Now, upload multiple tile images to comprise your photomosaic.
      </PageHeader>

      <BigButton
        disabled={!haveTiles}
        onClick={onConfirmTiles}
      >
        Create My Photomosaic
      </BigButton>

      <UploadFiles onUpload={onUploadTiles} multiple>
        <p>
          Drag and drop or click to upload multiple images.
          <br />
          JPG or PNG images only.
        </p>
      </UploadFiles>

      <div className={styles.note}>
        <p>
          Use as many images as possible for the best results.
        </p>

        <p>
          If a tile doesn't show up below, there might have been trouble
          processing it.
        </p>
      </div>

      <SelectedTiles />

      <div className={overlayClassName}>
        <Processing
          progressAmount={percentTilesUploaded}
          showProgressBar
        >
          Uploading Tiles...
          <br />
          {numTilesUploaded} / {numTilesUploading}
          <br />
          <small>
            Please wait as this may take a while when uploading multiple images.
          </small>
        </Processing>
      </div>
    </div>
  );
}

SelectTiles.propTypes = {
  haveTiles: PropTypes.bool,
  uploadingTiles: PropTypes.bool,
  numTilesUploaded: PropTypes.number,
  numTilesUploading: PropTypes.number,
  percentTilesUploaded: PropTypes.number,
  onConfirmTiles: PropTypes.func.isRequired,
  onUploadTiles: PropTypes.func.isRequired,
};
