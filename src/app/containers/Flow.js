import { connect } from 'react-redux';
import Flow from 'components/Flow';
import { getFsmState } from 'selectors';

export function mapStateToProps(state) {
  return {
    fsmState: getFsmState(state),
  };
}

export default connect(
  mapStateToProps
)(Flow);
