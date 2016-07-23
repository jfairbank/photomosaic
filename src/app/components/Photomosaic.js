import React, { PropTypes } from 'react';
import { ButtonToolbar, Button, Image } from 'react-bootstrap';

export default function Photomosaic({ url, onDownloadFull }) {
  return (
    <div>
      <Image src={url} width="500" />

      <br />
      <br />

      <ButtonToolbar>
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={onDownloadFull}
        >
          Download Full Resolution Image
        </Button>
      </ButtonToolbar>
    </div>
  );
}

Photomosaic.propTypes = {
  url: PropTypes.string.isRequired,
  onDownloadFull: PropTypes.func.isRequired,
};
