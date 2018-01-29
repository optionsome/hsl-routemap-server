import compose from "recompose/compose";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import mapProps from "recompose/mapProps";
import gql from "graphql-tag";
import { calculateStopsViewport } from "util/stopPoster";
import { PerspectiveMercatorViewport } from "viewport-mercator-project";

import apolloWrapper from "util/apolloWrapper";

import RouteMap from "./routeMap";

const MIN_ZOOM = 7;
const MAX_ZOOM = 18;

const mapPositionMapper = mapProps((props) => {
    const { latitude, longitude } = props;
    const viewport = new PerspectiveMercatorViewport({
        longitude,
        latitude,
        width: props.width,
        height: props.height,
        zoom: MIN_ZOOM,
    });

    console.log("zoom 1");
    console.log(viewport.zoom);
    const [minLon, minLat] = viewport.unproject([0, 0]);
    const [maxLon, maxLat] = viewport.unproject([props.width, props.height]);
    return {
        ...props, minLat, minLon, maxLat, maxLon,
    };
});

const nearbyTerminals = gql`
    query nearbyTerminals($minLat: Float!, $minLon: Float!, $maxLat: Float!, $maxLon: Float!) {
        stops: terminalsByBbox(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            edges {
                node {
                    nameFi
                    nameSe
                    lat
                    lon
                    modes {
                        nodes
                    }
                }
            }
        }
    },
`;

const stopsMapper = mapProps((props) => {
    const stops = props.data.stops.edges.map(i => i.node);

    const { projectedStops, viewport } = calculateStopsViewport({
        longitude: props.longitude,
        latitude: props.latitude,
        width: props.width,
        height: props.height,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        stops,
    });

    console.log(viewport);

    const mapOptions = {
        center: [props.longitude, props.latitude],
        width: props.width,
        height: props.height,
        zoom: viewport.zoom,
    };

    console.log("zoom 2");
    console.log(viewport.zoom);

    console.log(projectedStops);
    console.log(viewport);

    return {
        ...props,
        projectedStops,
        pixelsPerMeter: viewport.getDistanceScales().pixelsPerMeter[0],
        mapOptions,
    };
});

const hoc = compose(
    mapPositionMapper,
    graphql(nearbyTerminals),
    apolloWrapper(stopsMapper)
);

const RouteMapContainer = hoc(RouteMap);

RouteMapContainer.defaultProps = {
};

RouteMapContainer.propTypes = {
    date: PropTypes.string.isRequired,
};

export default RouteMapContainer;
