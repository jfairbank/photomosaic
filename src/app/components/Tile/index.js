import React, { Component, PropTypes } from 'react';
import { Image } from 'react-bootstrap';
import classNames from 'classnames';
import IconStack from 'components/IconStack';
import Icon from 'components/Icon';
import styles from './styles.css';

export default class SelectedTiles extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    onRemoveIcon: PropTypes.func.isRequired,
  };

  state = { shouldShowDeleteIcon: false };

  showDeleteIcon = () => {
    this.setState({ shouldShowDeleteIcon: true });
  };

  hideDeleteIcon = () => {
    this.setState({ shouldShowDeleteIcon: false });
  };

  removeIcon = () => {
    const { id, onRemoveIcon } = this.props;
    onRemoveIcon(id);
  };

  render() {
    const { shouldShowDeleteIcon } = this.state;
    const { src } = this.props;

    return (
      <span
        className={styles.tile}
        onMouseOver={this.showDeleteIcon}
        onMouseOut={this.hideDeleteIcon}
      >
        <Image src={src} thumbnail />

        <IconStack
          className={classNames(
            styles.deleteIcon,
            { [styles.deleteIconShow]: shouldShowDeleteIcon }
          )}
          onClick={this.removeIcon}
        >
          <Icon name="circle stack-2x" />
          <Icon name="trash stack-1x" />
        </IconStack>
      </span>
    );
  }
}
