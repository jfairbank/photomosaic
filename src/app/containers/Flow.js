import { connect } from 'react-redux';
import Flow from '../components/Flow';

export function mapStateToProps({ fsmState }) {
  return { fsmState };
}

export default connect(
  mapStateToProps
)(Flow);
