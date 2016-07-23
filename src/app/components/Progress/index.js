import React, { PropTypes } from 'react';
import { ProgressBar } from 'react-bootstrap';

export default function Progress({ amount }) {
  return (
    <ProgressBar bsStyle="success" now={amount} />
  );
}

Progress.propTypes = {
  amount: PropTypes.number.isRequired,
};
