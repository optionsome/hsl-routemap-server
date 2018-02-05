import React from "react";
import PropTypes from "prop-types";

const TerminusSymbol = props => (
    <svg width={props.size} height={props.size} style={{ display: "block" }}>
        <rect
            width={props.size}
            height={props.size}
            fill="#007AC9"
        />
    </svg>
);

TerminusSymbol.propTypes = {
    size: PropTypes.number.isRequired,
};

export default TerminusSymbol;
