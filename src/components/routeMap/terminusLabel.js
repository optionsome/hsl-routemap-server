import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";
import routeGeneralizer from "../../util/routeGeneralizer";

import style from "./terminusLabel.css";

const TerminusLabel = props => (
    <div className={style.label}>
        { props.nameFi &&
            <div className={style.header}>
                {props.nameFi}
            </div>
        }
        {
            routeGeneralizer(props.lines
                .map(id => trimRouteId(id)))
        }
    </div>
);

TerminusLabel.defaultProps = {
    nameFi: null,
};

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    nameFi: PropTypes.string,
};

export default TerminusLabel;
