import compose from "recompose/compose";
import PropTypes from "prop-types";

// import PropTypes from "prop-types";

import RouteMap from "./routeMap";

const hoc = compose();

const RouteMapContainer = hoc(RouteMap);

RouteMapContainer.defaultProps = {
};

RouteMapContainer.propTypes = {
    date: PropTypes.string.isRequired,
};

export default RouteMapContainer;
