import React from "react";
import PropTypes from "prop-types";
import style from "./legend.css";

const Legend = (props) => {
    const pxPerMeterRatio = 1 / props.meterPerPxRatio;
    const lengthInMeters = 1000;

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

Legend.propTypes = {
    meterPerPxRatio: PropTypes.number.isRequired,
};

export default Legend;
