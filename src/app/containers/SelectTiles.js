import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectTiles from 'components/SelectTiles';

import {
  uploadTiles,
  confirmTiles,
  changeMainImageCrop,
} from 'actions';

import {
  getTiles,
  getNumTilesUploaded,
  getNumTilesUploading,
  getPercentTilesUploaded,
  isUploadingTiles,
} from 'selectors';

export function mapStateToProps(state) {
  return {
    haveTiles: getTiles(state).length > 0,
    uploadingTiles: isUploadingTiles(state),
    numTilesUploaded: getNumTilesUploaded(state),
    numTilesUploading: getNumTilesUploading(state),
    percentTilesUploaded: getPercentTilesUploaded(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onUploadTiles: uploadTiles,
    onConfirmTiles: confirmTiles,
    onChangeMainImageCrop: changeMainImageCrop,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTiles);
