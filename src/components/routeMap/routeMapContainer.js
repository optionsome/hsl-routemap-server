import compose from "recompose/compose";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import mapProps from "recompose/mapProps";
import gql from "graphql-tag";
import { PerspectiveMercatorViewport } from "viewport-mercator-project";

import apolloWrapper from "util/apolloWrapper";

import RouteMap from "./routeMap";

const mapPositionMapper = mapProps((props) => {
    const { latitude, longitude } = props;
    const viewport = new PerspectiveMercatorViewport({
        longitude,
        latitude,
        width: props.width,
        height: props.height,
        zoom: props.zoom,
    });

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
    const { latitude, longitude } = props;

    const viewport = new PerspectiveMercatorViewport({
        longitude,
        latitude,
        width: props.width,
        height: props.height,
        zoom: props.zoom,
    });

    const projectedTerminals = stops
        .filter(stop => stop.modes && stop.modes.nodes && stop.modes.nodes.length)
        .map((stop) => {
            const [x, y] = viewport.project([stop.lon, stop.lat]);

            if (stop.modes.nodes.length > 1) {
                // eslint-disable-next-line no-console
                console.log(`We assume terminals to have one transportation node, however ${stop.nameFi} has several`);
            }

            return {
                nameFi: stop.nameFi,
                nameSe: stop.nameSe,
                node: stop.modes.nodes[0],
                x,
                y,
            };
        });

    const mapOptions = {
        center: [props.longitude, props.latitude],
        width: props.width,
        height: props.height,
        zoom: props.zoom,
    };

    return {
        mapOptions,
        projectedTerminals,
        date: props.date,
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
