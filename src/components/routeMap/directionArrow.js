import React from 'react';
import PropTypes from 'prop-types';
import styles from './directionArrow.css';

const DirectionArrow = props => {
  const style = {
    fontSize: `${props.size}px`,
  };
  return (
    <div className={styles.arrow} style={style}>
      &uarr;
    </div>
  );
};

DirectionArrow.propTypes = {
  size: PropTypes.number.isRequired,
};

export default DirectionArrow;
