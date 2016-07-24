import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { uploadTiles, confirmTiles } from 'actions';
import SelectTiles from 'components/SelectTiles';

import {
  getTiles,
  getNumTilesUploaded,
  getNumTilesUploading,
  getPercentTilesUploaded,
  isUploadingTiles,
} from 'selectors';

export function mapStateToProps(state) {
  const tiles = getTiles(state);

  return {
    tiles,
    haveTiles: tiles.length > 0,
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
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectTiles);
