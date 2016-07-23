import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';
import styles from './styles.css';

export default function Processing({ children }) {
  return (
    <div className={styles.processing}>
      <div className={styles.message}>
        {children}
      </div>

      <Spinner spinnerName="three-bounce" noFadeIn />
    </div>
  );
}

Processing.propTypes = {
  children: PropTypes.any.isRequired,
};
