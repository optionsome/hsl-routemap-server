import React from "react";
import PropTypes from "prop-types";

import style from "./terminusLabel.css";

const TerminusLabel = props => (
    <div className={style.label}>
        {
            props.lines.join(", ")
        }
    </div>
);

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TerminusLabel;
