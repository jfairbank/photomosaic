import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Progress from 'components/Progress';
import { setFsmState } from 'actions';
import * as fsm from 'fsm';

import {
  getFsmState,
  isUploadingTiles,
  canSelectMainImage,
  canCropMainImage,
  canSelectTiles,
  canViewPhotomosaic,
} from 'selectors';

export function mapStateToProps(state) {
  const fsmState = getFsmState(state);

  const showOverlay = (
    isUploadingTiles(state) ||
    fsmState === fsm.UPLOADING_MAIN_IMAGE ||
    fsmState === fsm.CREATING_PHOTOMOSAIC
  );

  return {
    fsmState,
    showOverlay,
    canSelectMainImage: canSelectMainImage(state),
    canCropMainImage: canCropMainImage(state),
    canSelectTiles: canSelectTiles(state),
    canViewPhotomosaic: canViewPhotomosaic(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onSelectMainImage: () => setFsmState(fsm.SELECT_MAIN_IMAGE),
    onCropMainImage: () => setFsmState(fsm.CROP_MAIN_IMAGE),
    onSelectTiles: () => setFsmState(fsm.SELECT_TILES),
    onViewPhotomosaic: () => setFsmState(fsm.DONE),
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Progress);
