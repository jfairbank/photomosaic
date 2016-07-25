import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getMainImageForCropping, getMainImageCrop } from '../selectors';
import MainImageCropper from '../components/MainImageCropper';

import {
  setMainImageCrop,
  confirmMainImageCrop,
  chooseDifferentImage,
} from '../actions';

export function mapStateToProps(state) {
  return {
    mainImage: getMainImageForCropping(state),
    mainImageCrop: getMainImageCrop(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onUpdateCrop: setMainImageCrop,
    onConfirmCrop: confirmMainImageCrop,
    onChooseDifferentImage: chooseDifferentImage,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainImageCropper);
