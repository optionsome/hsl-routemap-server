import React from "react";
import PropTypes from "prop-types";
import style from "./directionArrow.css";

const DirectionArrow = (props) => {
    const directionStyle = {
        "-webkit-transform": `rotate(${props.rotation}deg)`,
    };
    return (
        <div className={style.arrow} style={directionStyle}>&uarr;</div>
    );
};

DirectionArrow.propTypes = {
    rotation: PropTypes.number.isRequired,
};

export default DirectionArrow;
