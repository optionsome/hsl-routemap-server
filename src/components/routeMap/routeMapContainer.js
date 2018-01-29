import compose from "recompose/compose";
// import PropTypes from "prop-types";

import RouteMap from "./routeMap";

const hoc = compose();

const RouteMapContainer = hoc(RouteMap);

RouteMapContainer.defaultProps = {
};

RouteMapContainer.propTypes = {
};

export default RouteMapContainer;
