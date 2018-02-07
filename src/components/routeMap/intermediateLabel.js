import React from "react";
import PropTypes from "prop-types";

import style from "./terminusLabel.css";

const IntermediateLabel = props => (
    <div className={style.label}>
        {
            props.routes.join(", ")
        }
    </div>
);

IntermediateLabel.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IntermediateLabel;
