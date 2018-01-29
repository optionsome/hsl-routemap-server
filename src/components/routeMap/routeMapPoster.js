import React, { Component } from "react";
import PropTypes from "prop-types";

import RouteMap from "./routeMap";

class RouteMapPoster extends Component {
    constructor(props) {
        super(props);
        this.date = props.date;
    }

    render() {
        return (
            <RouteMap date/>
        );
    }
}

RouteMapPoster.propTypes = {
    date: PropTypes.string.isRequired,
};

export default RouteMapPoster;
