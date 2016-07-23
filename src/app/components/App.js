import React, { PropTypes } from 'react';
import Progress from 'containers/Progress';
import Flow from 'containers/Flow';

export default function App({ showProgress }) {
  return (
    <div>
      {showProgress && <Progress />}
      <Flow />
    </div>
  );
}

App.propTypes = {
  showProgress: PropTypes.bool.isRequired,
};
