import React from "react";
import viewportMercator from "viewport-mercator-project";
import { getStopsFromRoutes } from "util/routes";

import locationIcon from "icons/location.svg";
import busStopIcon from "icons/stopBus.svg";
// TODO: Use tram icon for tram stops
import tramStopIcon from "icons/stopTram.svg"; // eslint-disable-line

import styles from "./map.css";

function createViewport(mapOptions) {
    return viewportMercator({
        longitude: mapOptions.center[0],
        latitude: mapOptions.center[1],
        zoom: mapOptions.zoom,
        width: mapOptions.width,
        height: mapOptions.height,
    });
}

const Stop = (props) => {
    const [left, top] = props.viewport.project([props.stop.lon, props.stop.lat]);
    return (
        <div className={styles.stop} style={{ left, top }}>
            <img src={busStopIcon} role="presentation"/>
        </div>
    );
};

const Location = (props) => {
    const [left, top] = props.viewport.project([props.lon, props.lat]);
    return (
        <div className={styles.location} style={{ left, top }}>
            <img src={locationIcon} role="presentation"/>
        </div>
    );
};

const Map = (props) => {
    const viewport = createViewport(props.mapOptions);
    const miniViewport = createViewport(props.miniMapOptions);

    const stops = getStopsFromRoutes(props.routes)
        .filter(({ stopId }) => stopId !== props.stop.stopId)
        .filter(({ lon, lat }) => viewport.contains([lon, lat]));

    const mapStyle = { width: props.mapOptions.width, height: props.mapOptions.height };
    const miniMapStyle = { width: props.miniMapOptions.width, height: props.miniMapOptions.height };

    return (
        <div className={styles.root} style={mapStyle}>
            <div className={styles.container}>
                <img src={props.mapImage} role="presentation"/>
                {stops.map((stop, index) => <Stop key={index} viewport={viewport} stop={stop}/>)}
                <Location viewport={viewport} {...props.stop}/>
            </div>
            <div className={styles.miniMap} style={miniMapStyle}>
                <div className={styles.container}>
                    <img src={props.miniMapImage} role="presentation"/>
                    <Location viewport={miniViewport} {...props.stop}/>
                </div>
            </div>
        </div>
    );
};

export default Map;
