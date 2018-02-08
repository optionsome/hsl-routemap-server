import compose from "recompose/compose";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import mapProps from "recompose/mapProps";
import gql from "graphql-tag";
import { PerspectiveMercatorViewport } from "viewport-mercator-project";
import { isNumberVariant, trimRouteId, isDropOffOnly } from "util/domain";
import routeCompare from "util/routeCompare";
import flatMap from "lodash/flatMap";

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
    query nearbyTerminals($minLat: Float!, $minLon: Float!, $maxLat: Float!, $maxLon: Float!, $date: Date!) {
        terminals: terminalsByBbox(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
                nameFi
                nameSe
                lat
                lon
                modes {
                    nodes
                }
            }
        },
        stops: stopGroupedByShortIdByBbox(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
                stopIds
                lat
                lon
                nameFi
                nameSe
                stops {
                    nodes {
                        calculatedHeading
                        routeSegments: routeSegmentsForDate(date: $date) {
                            nodes {
                                routeId
                                hasRegularDayDepartures(date: $date)
                                pickupDropoffType
                                route {
                                    nodes {
                                        destinationFi
                                        destinationSe
                                        mode
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        terminus: terminusByDateAndBboxGrouped(date: $date, minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
                lineId
                stopAreaId
                lon
                lat
            }
        },
        intermediates: routeSectionIntermediates(date: $date, minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
              routes,
              lon,
              lat,
              angle
            }
          }
    },
`;

const stopsMapper = stopGroup => ({
    ...stopGroup,
    calculatedHeading: stopGroup.stops.nodes[0].calculatedHeading,
    routes: flatMap(stopGroup.stops.nodes, node =>
        node.routeSegments.nodes
            .filter(routeSegment => !isNumberVariant(routeSegment.routeId))
            .filter(routeSegment => !isDropOffOnly(routeSegment))
            .map(routeSegment => ({
                routeId: trimRouteId(routeSegment.routeId),
                destinationFi: routeSegment.route.nodes[0].destinationFi,
                destinationSe: routeSegment.route.nodes[0].destinationSe,
                mode: routeSegment.route.nodes[0].mode,
            }))).sort(routeCompare),
});

const terminalMapper = mapProps((props) => {
    const terminals = props.data.terminals.nodes;
    const stops = props.data.stops.nodes
        // Merge properties from mode-specific stops
        .map(stopsMapper)
        // Filter out stops with no departures
        .filter(stop => !!stop.routes.length);
    const terminuses = props.data.terminus.nodes;
    const intermediates = props.data.intermediates.nodes;
    const { latitude, longitude } = props;

    const viewport = new PerspectiveMercatorViewport({
        longitude,
        latitude,
        width: props.width,
        height: props.height,
        zoom: props.zoom,
    });

    const projectedTerminals = terminals
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

    const projectedStops = stops
        .map((stop) => {
            const [x, y] = viewport.project([stop.lon, stop.lat]);

            return {
                ...stop,
                x,
                y,
            };
        });

    const projectedIntermediates = intermediates
        .map((intermediate) => {
            const [x, y] = viewport.project([intermediate.lon, intermediate.lat]);

            return {
                ...intermediate,
                x,
                y,
            };
        });

    const projectedTerminuses = terminuses
        .map((terminus) => {
            const [x, y] = viewport.project([terminus.lon, terminus.lat]);

            return {
                ...terminus,
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
        projectedTerminuses,
        projectedIntermediates,
        projectedStops,
        date: props.date,
    };
});

const hoc = compose(
    mapPositionMapper,
    graphql(nearbyTerminals),
    apolloWrapper(terminalMapper)
);

const RouteMapContainer = hoc(RouteMap);

RouteMapContainer.defaultProps = {
};

RouteMapContainer.propTypes = {
    date: PropTypes.string.isRequired,
};

export default RouteMapContainer;
