import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectMainImage from 'components/SelectMainImage';
import { uploadMainImage } from 'actions';

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onUploadMainImage: uploadMainImage,
  }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps
)(SelectMainImage);
