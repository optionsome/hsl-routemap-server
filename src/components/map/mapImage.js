import React from "react";
import PropTypes from "prop-types";

const MapImage = (props) => {
    if (props.src) {
        console.warn("Fetch background image");
    }

    return (
        <img src={props.src} alt=""/>
    );
};

MapImage.propTypes = {
    src: PropTypes.string.isRequired,
};

export default MapImage;
