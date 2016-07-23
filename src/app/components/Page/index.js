import React, { PropTypes } from 'react';

export default function Page({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
