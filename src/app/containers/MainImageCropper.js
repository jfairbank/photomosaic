import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getMainImageCrop } from '../selectors';
import MainImageCropper from '../components/MainImageCropper';
import { setMainImageCrop, finalizeMainImageCrop } from '../actions';

export function mapStateToProps(state) {
  return {
    mainImage: state.mainImage,
    mainImageCrop: getMainImageCrop(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onUpdateCrop: setMainImageCrop,
    onFinalizeCrop: finalizeMainImageCrop,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainImageCropper);
