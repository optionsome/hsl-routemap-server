import React from "react";
import PropTypes from "prop-types";

import style from "./intermediateLabel.css";

const IntermediateLabel = props => (
    <div className={style.label}>
        {
            props.label
        }
    </div>
);

IntermediateLabel.propTypes = {
    label: PropTypes.string.isRequired,
};

export default IntermediateLabel;
