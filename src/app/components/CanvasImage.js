import React, { Component } from 'react';
import nj from 'numjs';
import { ImagePropType } from '../propTypes';

export default class CanvasImage extends Component {
  static propTypes = {
    imageData: ImagePropType.isRequired,
  };

  componentDidMount() {
    this.updateCanvas();
  }

  updateCanvas() {
    nj.images.save(this.props.imageData, this.refs.canvas);
  }

  render() {
    const { imageData } = this.props;

    return (
      <canvas
        ref="canvas"
        width={imageData.shape[1]}
        height={imageData.shape[0]}
      />
    );
  }
}
