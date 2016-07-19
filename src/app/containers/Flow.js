import { connect } from 'react-redux';
import Flow from '../components/Flow';

export function mapStateToProps({ mainImage, tiles, fsmState }) {
  return { mainImage, tiles, fsmState };
}

export default connect(
  mapStateToProps
)(Flow);
