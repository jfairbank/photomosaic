import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPhotomosaic, getTileSize } from 'selectors';
import Photomosaic from 'components/Photomosaic';
import { downloadPhotomosaic, restart, setTileSize } from 'actions';

export function mapStateToProps(state) {
  return {
    url: getPhotomosaic(state).displayUrl,
    tileSize: getTileSize(state).key,
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onDownloadFull: downloadPhotomosaic,
    onRestart: restart,
    onSetSmallTileSize: () => setTileSize('small'),
    onSetMediumTileSize: () => setTileSize('medium'),
    onSetLargeTileSize: () => setTileSize('large'),
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Photomosaic);
