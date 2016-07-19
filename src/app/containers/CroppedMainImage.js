import { connect } from 'react-redux';
import { getCroppedMainImageData } from '../selectors';
import CanvasImage from '../components/CanvasImage';

export function mapStateToProps(state) {
  return {
    imageData: getCroppedMainImageData(state),
  };
}

export default connect(
  mapStateToProps
)(CanvasImage);
