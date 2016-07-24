import React, { PropTypes } from 'react';

export default function Icon({ name }) {
  const names = name.split(/\s+/).map(n => `fa-${n}`).join(' ');

  return <i className={`fa ${names}`} />;
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};
