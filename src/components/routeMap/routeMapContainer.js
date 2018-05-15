import compose from "recompose/compose";
import PropTypes from "prop-types";
import { graphql } from "react-apollo";
import mapProps from "recompose/mapProps";
import gql from "graphql-tag";
import { PerspectiveMercatorViewport } from "viewport-mercator-project";
import { trimRouteId, isSubwayRoute, isRailRoute, isNumberVariant, isDropOffOnly, getRouteType } from "util/domain";
import { getMostCommonAngle, getOneDirectionalAngle } from "util/routeAngles";
import apolloWrapper from "util/apolloWrapper";
import flatMap from "lodash/flatMap";
import routeCompare from "util/routeCompare";

import routeGeneralizer from "../../util/routeGeneralizer";
import RouteMap from "./routeMap";

const mapPositionMapper = mapProps((props) => {
    const { mapOptions, configuration } = props;

    const viewport = new PerspectiveMercatorViewport({
        longitude: mapOptions.center[0],
        latitude: mapOptions.center[1],
        zoom: mapOptions.zoom,
        width: mapOptions.width,
        height: mapOptions.height,
    });
    const longitude = mapOptions.center[0];
    const latitude = mapOptions.center[1];

    const [minLon, minLat] = viewport.unproject([0, 0], { topLeft: true });
    const [maxLon, maxLat]
        = viewport.unproject([mapOptions.width, mapOptions.height], { topLeft: true });

    return {
        ...props,
        minLat,
        minLon,
        maxLat,
        maxLon,
        width: mapOptions.width,
        height: mapOptions.height,
        longitude,
        latitude,
        configuration,
        date: props.configuration.date,
        meterPerPxRatio: mapOptions.meterPerPxRatio,
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
        terminus: terminusByDateAndBboxGrouped(date: $date, minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
                lines
                stopAreaId
                type
                lon
                lat
                terminalId
                nameFi
                nameSe
            }
        },
        intermediates: getIntermediatePoints(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
              routes,
              lon,
              lat,
              angles,
              length
            }
        },
        terminalNames: getTerminalnames(date: $date, minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
              lat,
              lon,
              nameFi,
              nameSe,
              type,
              terminalId
            }
        },
        stopGroups: regularStopGroupedByShortIdByBbox(minLat: $minLat, minLon: $minLon, maxLat: $maxLat, maxLon: $maxLon) {
            nodes {
                stopIds
                shortId
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
        }
    },
`;

const terminalMapper = mapProps((props) => {
    const terminals = props.data.terminals.nodes;
    const terminuses = props.data.terminus.nodes;
    const intermediates = props.data.intermediates.nodes;
    const terminalNames = props.data.terminalNames.nodes;
    const stops = props.data.stopGroups.nodes;

    const viewport = new PerspectiveMercatorViewport({
        longitude: props.mapOptions.center[0],
        latitude: props.mapOptions.center[1],
        zoom: props.mapOptions.zoom,
        width: props.width,
        height: props.height,
    });

    const projectedTerminals = terminals
        .filter(stop => stop.modes && stop.modes.nodes && stop.modes.nodes.length)
        .map((stop) => {
            const [x, y] = viewport.project([stop.lon, stop.lat]);

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
                x,
                y,
                routes: flatMap(stop.stops.nodes, node =>
                    node.routeSegments.nodes
                        .filter(routeSegment => !isNumberVariant(routeSegment.routeId))
                        .filter(routeSegment => !isDropOffOnly(routeSegment))
                        .filter(routeSegment => routeSegment.route.nodes.length)
                        .map(routeSegment => ({
                            routeId: trimRouteId(routeSegment.routeId),
                            destinationFi: routeSegment.route.nodes[0].destinationFi,
                            destinationSe: routeSegment.route.nodes[0].destinationSe,
                            mode: routeSegment.route.nodes[0].mode,
                        }))).sort(routeCompare),
            };
        }).filter(stop => stop.routes.length);

    const projectedTerminalNames = terminalNames
        .map((terminalName) => {
            const [x, y] = viewport.project([terminalName.lon, terminalName.lat]);
            return {
                ...terminalName,
                x,
                y,
            };
        });

    const projectedIntermediates = intermediates
        .map(intermediate => ({
            ...intermediate,
            routes: intermediate.routes
                .filter(id => !isRailRoute(id) && !isSubwayRoute(id) && id !== null),
        }))
        .map(intermediate => ({
            ...intermediate,
            label: routeGeneralizer(intermediate.routes.map(id => trimRouteId(id))),
        }))
        .filter(intermediate =>
            intermediate.label.length > 0 && (
                intermediate.label.length < 50
                || (intermediate.length > 250 && intermediate.label.length < 100)
                || intermediate.length > 500
            ))
        .map(intermediate => ({
            ...intermediate,
            angle: getMostCommonAngle(intermediate.angles),
            oneDirectionalAngle: getOneDirectionalAngle(intermediate.angles),
        }))
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
                lines: terminus.lines.filter(id => !isRailRoute(id) && !isSubwayRoute(id)),
                type: getRouteType(terminus.type),
                x,
                y,
            };
        })
        .filter(terminus => terminus.lines.length > 0);

    const mapOptions = {
        center: [props.longitude, props.latitude],
        width: props.width,
        height: props.height,
        zoom: props.mapOptions.zoom,
    };

    const mapComponents = {
        text_fisv: { enabled: true },
        regular_routes: { enabled: true },
        municipal_borders: { enabled: true },
    };

    return {
        mapOptions,
        configuration: props.configuration,
        meterPerPxRatio: props.meterPerPxRatio,
        mapComponents,
        projectedTerminals,
        projectedTerminalNames,
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

const MapOptionsProps = {
    bearing: PropTypes.number.isRequired,
};

const ConfigurationOptionsProps = {
    date: PropTypes.string.isRequired,
};

RouteMapContainer.propTypes = {
    mapOptions: PropTypes.shape(MapOptionsProps).isRequired,
    configuration: PropTypes.shape(ConfigurationOptionsProps).isRequired,
};

export default RouteMapContainer;
