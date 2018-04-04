import React from "react";
import PropTypes from "prop-types";
import { trimRouteId } from "../../util/domain";
import routeGeneralizer from "../../util/routeGeneralizer";

import style from "./terminusLabel.css";

const TerminusLabel = props => (
    <div className={style.label}>
        { (props.nameFi || props.nameSe) &&
            <div className={style.header}>
                {props.nameFi && [
                    <span key="nameFi">{props.nameFi}</span>,
                    <br key="B1"/>,
                ]}
                {(props.nameSe && props.nameSe !== props.nameFi)
                    && [
                        <span key="nameSe">{props.nameSe}</span>,
                        <br key="B2"/>,
                    ]}
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
    nameSe: null,
};

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    nameFi: PropTypes.string,
    nameSe: PropTypes.string,
};

export default TerminusLabel;
