import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { ImagePropType } from 'propTypes';
import Tile from 'components/Tile';
import Icon from 'components/Icon';
import styles from './styles.css';

export default class SelectedTiles extends Component {
  static propTypes = {
    haveTiles: PropTypes.bool,
    tiles: PropTypes.arrayOf(ImagePropType),
    onRemoveIcon: PropTypes.func.isRequired,
    onRemoveAllIcons: PropTypes.func.isRequired,
  };

  state = { showN: 20 };

  showMore = () => {
    this.setState({ showN: this.state.showN + 20 });
  };

  render() {
    const { showN } = this.state;

    const {
      haveTiles,
      tiles,
      onRemoveIcon,
      onRemoveAllIcons,
    } = this.props;

    const numTiles = tiles.length;
    const haveMoreTiles = numTiles > showN;
    const showingNTiles = Math.min(numTiles, showN);
    const displayTiles = haveMoreTiles ? tiles.slice(0, showN) : tiles;
    const tilesSingularPlural = numTiles === 1 ? 'Tile' : 'Tiles';

    if (!haveTiles) {
      return null;
    }

    return (
      <div className={styles.selectedTiles}>
        <h2 className={styles.header}>
          Showing {showingNTiles} of {numTiles} {tilesSingularPlural} Uploaded
        </h2>

        <Button
          className={styles.showMoreButton}
          bsStyle="danger"
          onClick={onRemoveAllIcons}
        >
          <Icon name="trash-o lg" />
          {' '}
          Remove All Tiles
        </Button>

        <div className={styles.tiles}>
          {displayTiles.map((tile, i) => (
            <Tile
              key={tile.url}
              id={i}
              src={tile.url}
              onRemoveIcon={onRemoveIcon}
            />
          ))}
        </div>

        {haveMoreTiles &&
          <Button
            className={styles.showMoreButton}
            bsStyle="primary"
            bsSize="large"
            onClick={this.showMore}
          >
            Show More
          </Button>
        }
      </div>
    );
  }
}
