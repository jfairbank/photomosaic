import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';
import { ProgressBar } from 'react-bootstrap';
import styles from './styles.css';

export default function Processing({
  children,
  progressAmount,
  progressLabel,
  showProgressBar,
}) {
  return (
    <div className={styles.processing}>
      <div className={styles.message}>
        {children}
      </div>

      {showProgressBar ?
        <ProgressBar
          className={styles.progressBar}
          now={progressAmount}
          label={progressLabel}
        /> :

        <Spinner spinnerName="three-bounce" noFadeIn />
      }
    </div>
  );
}

Processing.propTypes = {
  children: PropTypes.any.isRequired,
  progressAmount: PropTypes.number,
  progressLabel: PropTypes.string,
  showProgressBar: PropTypes.bool,
};
