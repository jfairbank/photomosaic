import { connect } from 'react-redux';
import { getPhotomosaic } from '../selectors';
import Photomosaic from '../components/Photomosaic';

export function mapStateToProps(state) {
  return {
    url: getPhotomosaic(state).url,
  };
}

export default connect(
  mapStateToProps
)(Photomosaic);
