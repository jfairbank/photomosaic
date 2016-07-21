import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';
// import CroppedMainImage from '../containers/CroppedMainImage';

export default function SelectTiles({ onUploadTiles }) {
// export default function SelectTiles() {
  return (
    <div>
      <Dropzone onDrop={onUploadTiles} multiple>
        <div>Upload tile images</div>
      </Dropzone>
    </div>
  );
}
// <CroppedMainImage />

SelectTiles.propTypes = {
  onUploadTiles: PropTypes.func.isRequired,
};
