import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";
import routeGeneralizer from "../../util/routeGeneralizer";

import style from "./terminusLabel.css";

const TerminusLabel = props => (
    <div className={style.label}>
        {
            routeGeneralizer(props.lines
                .map(id => trimRouteId(id)))
        }
    </div>
);

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TerminusLabel;
