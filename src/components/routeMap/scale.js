import React from "react";
import PropTypes from "prop-types";
import style from "./scale.css";

const Scale = (props) => {
    const pxPerMeterRatio = 1 / props.meterPerPxRatio;
    const lengthInMeters = props.scaleLength;

    const lengthInDots = pxPerMeterRatio * lengthInMeters;

    const lengthStyle = {
        width: `${lengthInDots}px`,
    };

    const metersToKM = m => Math.round(m / 1000);

    return (
        <div className={style.container} style={lengthStyle}>
            <div className={style.distance}>{`${metersToKM(lengthInMeters)}km`}</div>
            <div className={style.meter}/>
        </div>
    );
};

Scale.propTypes = {
    meterPerPxRatio: PropTypes.number.isRequired,
    scaleLength: PropTypes.number.isRequired,
};

export default Scale;
