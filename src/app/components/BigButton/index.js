import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import styles from './styles.css';

export default function BigButton({ children, disabled, onClick }) {
  return (
    <div className={styles.container}>
      <Button
        className={styles.button}
        bsStyle="primary"
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
}

BigButton.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
