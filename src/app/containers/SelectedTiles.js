import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectedTiles from 'components/SelectedTiles';
import { getTiles } from 'selectors';
import { removeIcon, removeAllIcons } from 'actions';

export function mapStateToProps(state) {
  const tiles = getTiles(state);

  return {
    tiles,
    haveTiles: tiles.length > 0,
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onRemoveIcon: removeIcon,
    onRemoveAllIcons: removeAllIcons,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedTiles);
