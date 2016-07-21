import { connect } from 'react-redux';
import { getPhotoMosaicData } from '../selectors';
import CanvasImage from '../components/CanvasImage';

export function mapStateToProps(state) {
  return {
    imageData: getPhotoMosaicData(state),
  };
}

export default connect(
  mapStateToProps
)(CanvasImage);
