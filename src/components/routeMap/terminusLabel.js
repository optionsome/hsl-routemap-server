import React from "react";
import PropTypes from "prop-types";
import { trimRouteId, routeTypes } from "../../util/domain";
import routeGeneralizer from "../../util/routeGeneralizer";

import style from "./terminusLabel.css";

const TerminusLabel = ({
    nameFi, nameSe, lines, configuration, type,
}) => {
    const terminusStyle = {
        fontSize: `${configuration.terminusFontSize}px`,
        lineHeight: `${configuration.terminusFontSize}px`,
        maxWidth: `${configuration.terminusWidth}px`,
        color: type === routeTypes.TRAM ? "#387f53" : "#0379c8",
    };

    return (
        <div className={style.label} style={terminusStyle}>
            { (nameFi || nameSe) &&
                <div>
                    {nameFi && [
                        <span key="nameFi" className={style.headerFi}>{nameFi}</span>,
                        <br key="B1"/>,
                    ]}
                    {(nameSe && nameSe !== nameFi)
                        && [
                            <span key="nameSe" className={style.headerSe}>{nameSe}</span>,
                            <br key="B2"/>,
                        ]}
                </div>
            }
            {
                routeGeneralizer(lines
                    .map(id => trimRouteId(id)))
            }
        </div>
    );
};

const TerminusConfiguration = PropTypes.shape({
    terminusFontSize: PropTypes.number.isRequired,
    terminusWidth: PropTypes.number.isRequired,
});

TerminusLabel.defaultProps = {
    nameFi: null,
    nameSe: null,
};

TerminusLabel.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    configuration: PropTypes.shape(TerminusConfiguration).isRequired,
    nameFi: PropTypes.string,
    nameSe: PropTypes.string,
    type: PropTypes.string.isRequired,
};

export default TerminusLabel;
