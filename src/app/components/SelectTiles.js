import React, { PropTypes } from 'react';
// import Dropzone from 'react-dropzone';
import CroppedMainImage from '../containers/CroppedMainImage';

// export default function SelectTiles({ onUploadTiles }) {
export default function SelectTiles() {
  return (
    <div>
      <CroppedMainImage />
    </div>
  );
}
// <Dropzone onDrop={onUploadTiles} multiple>
//   <div>Upload tile images</div>
// </Dropzone>

SelectTiles.propTypes = {
  onUploadTiles: PropTypes.func.isRequired,
};
