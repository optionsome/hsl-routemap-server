import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";

import style from "./intermediateLabel.css";

const IntermediateLabel = props => (
    <div className={style.label}>
        {
            props.routes
                .map(id => trimRouteId(id))
                .filter((item, pos, self) => self.indexOf(item) === pos)
                .sort()
                .join(", ")
        }
    </div>
);

IntermediateLabel.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default IntermediateLabel;
