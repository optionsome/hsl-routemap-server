import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";
import routeGeneralizer from "../../util/routeGeneralizer";

import style from "./intermediateLabel.css";

const IntermediateLabel = (props) => {
    const labelText = routeGeneralizer(props.routes
        .filter(id => id)
        .map(id => trimRouteId(id)));

    if (labelText.length < 40) {
        return (
            <div className={style.label}>{labelText}</div>
        );
    }
    return null;
};

IntermediateLabel.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IntermediateLabel;
