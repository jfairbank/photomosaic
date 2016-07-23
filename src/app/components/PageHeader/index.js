import React, { PropTypes } from 'react';
import styles from './styles.css';

export default function PageHeader({ children }) {
  return (
    <h1 className={styles.pageHeader}>
      {children}
    </h1>
  );
}

PageHeader.propTypes = {
  children: PropTypes.any,
};
