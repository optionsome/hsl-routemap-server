import React from 'react';
import PropTypes from 'prop-types';

import style from './stationName.css';

const StationName = ({ type, nameSe, nameFi, configuration }) => {
  const stationStyle = {
    fontSize: `${configuration.stationFontSize}px`,
    lineHeight: `${configuration.stationFontSize}px`,
  };

  return (
    <div className={type === '06' ? style.metro : style.rail} style={stationStyle}>
      <span>{nameFi}</span>
      {nameSe && nameSe !== nameFi && [<br key="B" />, <span key="nameSe">{nameSe}</span>]}
    </div>
  );
};

StationName.defaultProps = {
  nameFi: null,
  nameSe: null,
};

const StationConfiguration = {
  stationFontSize: PropTypes.number.isRequired,
};

StationName.propTypes = {
  nameFi: PropTypes.string,
  nameSe: PropTypes.string,
  type: PropTypes.string.isRequired,
  configuration: PropTypes.shape(StationConfiguration).isRequired,
};

export default StationName;
