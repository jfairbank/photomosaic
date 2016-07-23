import React, { PropTypes } from 'react';
import { Button, Image } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import BigButton from 'components/BigButton';
import styles from './styles.css';

export default function Photomosaic({ url, onDownloadFull, onRestart }) {
  return (
    <div className={styles.photomosaic}>
      <PageHeader>
        Here's your photomosaic!
      </PageHeader>

      <BigButton onClick={onDownloadFull}>
        Download Hi-Res Photomosaic
      </BigButton>

      <Button
        className={styles.restartLink}
        bsStyle="link"
        onClick={onRestart}
      >
        Create Another Photomosaic
      </Button>

      <div className={styles.preview}>
        <Image src={url} />
      </div>
    </div>
  );
}

Photomosaic.propTypes = {
  url: PropTypes.string.isRequired,
  onDownloadFull: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
};
