import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTiles, isUploadingTiles } from '../selectors';
import { uploadTiles, confirmTiles } from '../actions';
import SelectTiles from '../components/SelectTiles';

export function mapStateToProps(state) {
  const tiles = getTiles(state);

  return {
    tiles,
    haveTiles: tiles.length > 0,
    uploadingTiles: isUploadingTiles(state),
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
