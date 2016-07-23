import { connect } from 'react-redux';
import { getProgressAmount } from 'selectors';
import Progress from 'components/Progress';

export function mapStateToProps(state) {
  return {
    amount: getProgressAmount(state),
  };
}

export default connect(
  mapStateToProps
)(Progress);
