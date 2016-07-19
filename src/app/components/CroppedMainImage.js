import React, { Component } from 'react';
import nj from 'numjs';
import { ImagePropType, CroppedCoordsPropType } from '../propTypes';

export default class CroppedMainImage extends Component {
  static propTypes = {
    croppedMainImage: ImagePropType.isRequired,
    croppedCoords: CroppedCoordsPropType.isRequired,
  };

  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    nj.images.save(this.props.croppedMainImage, this.refs.canvas);
  }

  render() {
    const { croppedMainImage } = this.props;

    return (
      <canvas
        ref="canvas"
        width={croppedMainImage.shape[1]}
        height={croppedMainImage.shape[0]}
      />
    );
  }
}
