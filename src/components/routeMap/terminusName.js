import React from "react";
import PropTypes from "prop-types";

import style from "./terminusName.css";


const TerminusName = props => (
    <div className={props.type === "06" ? style.metro : style.rail}>
        {props.nameFi}
    </div>
);

TerminusName.defaultProps = {
    nameFi: null,
};

TerminusName.propTypes = {
    nameFi: PropTypes.string,
    type: PropTypes.string.isRequired,
};

export default TerminusName;
