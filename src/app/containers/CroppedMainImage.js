import { connect } from 'react-redux';
import { getResizedCroppedMainImageData } from '../selectors';
import CanvasImage from '../components/CanvasImage';

export function mapStateToProps(state) {
  return {
    imageData: getResizedCroppedMainImageData(state),
  };
}

export default connect(
  mapStateToProps
)(CanvasImage);