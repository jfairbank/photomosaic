import { connect } from 'react-redux';
import { getFsmState } from 'selectors';
import App from 'components/App';
import * as fsm from 'fsm';

export function mapStateToProps(state) {
  const fsmState = getFsmState(state);
  const showProgress = fsmState !== fsm.DONE;

  return { showProgress };
}

export default connect(
  mapStateToProps
)(App);
