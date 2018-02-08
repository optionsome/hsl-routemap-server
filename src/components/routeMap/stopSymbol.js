import React from "react";
import PropTypes from "prop-types";

import { colorsByMode } from "util/domain";

const StopSymbol = props => (
    <svg width={props.size} height={props.size} style={{ display: "block" }}>
        <circle
            cx={props.size / 2}
            cy={props.size / 2}
            r={props.size / 2}
            fill={colorsByMode.BUS}
        />
    </svg>
);

StopSymbol.propTypes = {
    size: PropTypes.number.isRequired,
};

export default StopSymbol;
