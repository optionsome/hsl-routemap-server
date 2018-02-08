import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";

import style from "./terminusLabel.css";

const TerminusLabel = props => (
    <div className={style.label}>
        {
            props.lines
                .map(id => trimRouteId(id))
                .join(", ")
        }
    </div>
);

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TerminusLabel;
