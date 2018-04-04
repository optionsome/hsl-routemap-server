import React from "react";
import PropTypes from "prop-types";

import style from "./stationName.css";


const StationName = props => (
    <div className={props.type === "06" ? style.metro : style.rail}>
        {props.nameFi}
        {(props.nameSe && props.nameSe !== props.nameFi) && [
            <br key="B"/>,
            <span key="nameSe">{props.nameSe}</span>,
        ]}
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
