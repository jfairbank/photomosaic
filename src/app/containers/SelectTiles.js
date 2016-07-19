import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectTiles from '../components/SelectTiles';
import { uploadTiles } from '../actions';

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({ onUploadTiles: uploadTiles }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps
)(SelectTiles);
