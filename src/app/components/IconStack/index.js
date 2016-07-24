import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default function IconStack({
  children,
  className,
  onClick,
  size = 'lg',
}) {
  return (
    <span
      className={classNames('fa-stack', `fa-${size}`, className)}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

IconStack.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string,
};
