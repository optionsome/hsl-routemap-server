import React from "react";
import PropTypes from "prop-types";

import style from "./intermediateLabel.css";

const IntermediateLabel = ({ label, configuration }) => {
    const intermediateStyle = {
        fontSize: `${configuration.intermediatePointFontSize}px`,
        lineHeight: `${configuration.intermediatePointFontSize}px`,
        maxWidth: `${configuration.intermediatePointWidth}px`,
    };

    function intersperse(arr, sep) {
        if (arr.length === 0) {
            return [];
        }

        return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
    }

    return (
        <div className={style.label} style={intermediateStyle}>
            {
                intersperse(label.map(item => <span className={item.type === "tram" ? style.tram : style.bus}>{item.text}</span>), ", ")
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
