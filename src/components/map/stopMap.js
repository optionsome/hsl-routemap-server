import React from "react";
import PropTypes from "prop-types";
import ItemContainer from "components/itemContainer";
import ItemFixed from "components/itemFixed";
import ItemPositioned from "components/itemPositioned";
import { Row } from "components/util";

import locationIcon from "icons/marker.svg";

import MapImage from "./mapImageContainer";
import Scalebar from "./scalebar";
import StopSymbol from "./stopSymbol";
import StopLabel from "./stopLabel";

import styles from "./stopMap.css";

// Map symbol size
const STOP_RADIUS = 20;
const LOCATION_RADIUS = 30;
const LOCATION_RADIUS_MINI = 10;

// Mini map position
const MINI_MAP_MARGIN_RIGHT = 60;
const MINI_MAP_MARGIN_BOTTOM = -40;

// Overlays
const INFO_MARGIN_BOTTOM = 78;
const INFO_MARGIN_LEFT = 20;

const Attribution = () => (
    <div className={styles.attribution}>
        &copy; OpenStreetMap
    </div>
);

const LocationSymbol = props => (
    <div style={{ width: props.size, height: props.size }}>
        <img src={locationIcon} style={{ width: "100%" }}/>
    </div>
);

LocationSymbol.propTypes = {
    size: PropTypes.number.isRequired,
};

const StopMap = (props) => {
    const mapStyle = {
        width: props.mapOptions.width,
        height: props.mapOptions.height,
    };
    const miniMapStyle = {
        left: mapStyle.width - MINI_MAP_MARGIN_RIGHT - props.miniMapOptions.width,
        top: mapStyle.height - MINI_MAP_MARGIN_BOTTOM - props.miniMapOptions.height,
        width: props.miniMapOptions.width,
        height: props.miniMapOptions.height,
    };

    // Filter out stops that are behind the mini map
    const stops = props.nearbyStops.filter(
        stop => stop.x < miniMapStyle.left || stop.y < miniMapStyle.top
    );

    return (
        <div className={styles.root} style={mapStyle}>
            <div className={styles.map}>
                <MapImage
                    options={props.mapOptions}
                    components={{
                        text_fisv: { enabled: true },
                        routes: { enabled: true, fetchRoutes: true },
                        citybikes: { enabled: true },
                        print: { enabled: true },
                    }}
                    date={props.date}
                />
            </div>

            <div className={styles.overlays}>
                <ItemContainer>
                    {stops.map((stop, index) => (
                        <ItemFixed
                            key={index}
                            top={stop.y - STOP_RADIUS}
                            left={stop.x - STOP_RADIUS}
                        >
                            <StopSymbol routes={stop.routes} size={STOP_RADIUS * 2}/>
                        </ItemFixed>
                    ))}

                    <ItemFixed
                        top={props.currentStop.y - STOP_RADIUS}
                        left={props.currentStop.x - STOP_RADIUS}
                    >
                        <StopSymbol routes={props.currentStop.routes} size={STOP_RADIUS * 2}/>
                    </ItemFixed>

                    <ItemFixed
                        top={(mapStyle.height / 2) - (2 * LOCATION_RADIUS)}
                        left={(mapStyle.width / 2) - LOCATION_RADIUS}
                    >
                        <Row style={{ height: LOCATION_RADIUS * 2 }}>
                            <LocationSymbol size={LOCATION_RADIUS * 2}/>
                            <div className={styles.title}>Olet tässä</div>
                            <div className={styles.subtitle}>Du är här</div>
                        </Row>
                    </ItemFixed>

                    {stops.map((stop, index) => (
                        <ItemPositioned
                            key={index}
                            x={stop.x}
                            y={stop.y}
                            distance={25}
                            angle={stop.calculatedHeading}
                        >
                            <StopLabel {...stop}/>
                        </ItemPositioned>
                    ))}

                    <ItemFixed top={mapStyle.height - INFO_MARGIN_BOTTOM} left={INFO_MARGIN_LEFT}>
                        <div>
                            <Scalebar targetWidth={250} pixelsPerMeter={props.pixelsPerMeter}/>
                            <Attribution/>
                        </div>
                    </ItemFixed>

                    <ItemFixed top={miniMapStyle.top} left={miniMapStyle.left}>
                        <div style={miniMapStyle}/>
                    </ItemFixed>
                </ItemContainer>
            </div>

            <div className={styles.miniMap} style={miniMapStyle}>
                <MapImage
                    options={props.miniMapOptions}
                    components={{
                        text_fisv: { enabled: true },
                        print: { enabled: true },
                        routes: { enabled: true, removeSource: true },
                    }}
                />
                <div
                    className={styles.center}
                    style={{
                        marginLeft: -LOCATION_RADIUS_MINI,
                        marginTop: -2 * LOCATION_RADIUS_MINI,
                    }}
                >
                    <LocationSymbol size={LOCATION_RADIUS_MINI * 2}/>
                </div>
            </div>
        </div>
    );
};

const StopType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
        routeId: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    stopIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    calculatedHeading: PropTypes.number.isRequired,
});

StopMap.propTypes = {
    mapOptions: MapImage.propTypes.options,
    miniMapOptions: MapImage.propTypes.options,
    currentStop: StopType.isRequired,
    nearbyStops: PropTypes.arrayOf(StopType).isRequired,
    pixelsPerMeter: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
};

export default StopMap;
