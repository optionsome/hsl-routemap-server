import React from "react";
import PropTypes from "prop-types";

import style from "./stationName.css";


const StationName = props => (
    <div className={props.type === "06" ? style.metro : style.rail}>
        {props.nameFi}
        <br/>
        {props.nameSe}
    </div>
);

StationName.defaultProps = {
    nameFi: null,
    nameSe: null,
};

StationName.propTypes = {
    nameFi: PropTypes.string,
    nameSe: PropTypes.string,
    type: PropTypes.string.isRequired,
};

export default StationName;
