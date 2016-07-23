import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPhotomosaic } from '../selectors';
import Photomosaic from '../components/Photomosaic';
import { downloadPhotomosaic } from '../actions';

export function mapStateToProps(state) {
  return {
    url: getPhotomosaic(state).displayUrl,
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onDownloadFull: downloadPhotomosaic,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Photomosaic);
