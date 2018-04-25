import React from "react";
import PropTypes from "prop-types";

import style from "./intermediateLabel.css";

const IntermediateLabel = ({ label, configuration }) => {
    const intermediateStyle = {
        fontSize: `${configuration.intermediatePointFontSize}px`,
        lineHeight: `${configuration.intermediatePointFontSize}px`,
        maxWidth: `${configuration.intermediatePointWidth}px`,
    };

    return (
        <div className={style.label} style={intermediateStyle}>
            {
                label
            }
        </div>
    );
};

const IntermediateConfiguration = PropTypes.shape({
    intermediatePointFontSize: PropTypes.number.isRequired,
    intermediatePointWidth: PropTypes.number.isRequired,
});

IntermediateLabel.propTypes = {
    label: PropTypes.string.isRequired,
    configuration: PropTypes.shape(IntermediateConfiguration).isRequired,
};

export default IntermediateLabel;
