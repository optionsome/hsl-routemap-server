import React from "react";
import PropTypes from "prop-types";
import MapImage from "components/map/mapImageContainer";
import ItemContainer from "components/labelPlacement/itemContainer";
import ItemFixed from "components/labelPlacement/itemFixed";
import StopSymbol from "../map/stopSymbol";

import styles from "./routeMap.css";

const STOP_RADIUS = 12;

const RouteMap = (props) => {
    const positionedStops = props.projectedStops;

    const mapStyle = {
        width: props.mapOptions.width,
        height: props.mapOptions.height,
    };

    return (
        <div className={styles.root}>
            <div className={styles.map} style={mapStyle}>
                <MapImage
                    options={props.mapOptions}
                    components={{
                        text_fisv: { enabled: true },
                        routes: { enabled: true },
                        stops: { enabled: true },
                        municipal_borders: { enabled: true },
                    }}
                    date={props.date}
                />
            </div>
            <div className={styles.overlays}>
                <ItemContainer>
                    {positionedStops.map((stop, index) => (
                        <ItemFixed
                            key={index}
                            top={stop.y - STOP_RADIUS}
                            left={stop.x - STOP_RADIUS}
                        >
                            <StopSymbol routes={[{ routeId: "1234", mode: "BUS" }]} size={STOP_RADIUS * 2}/>
                        </ItemFixed>
                    ))}
                </ItemContainer>
            </div>
        </div>
    );
};

RouteMap.defaultProps = {
};

const StopType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
});

const MapOptions = PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
});

RouteMap.propTypes = {
    date: PropTypes.string.isRequired,
    projectedStops: PropTypes.arrayOf(StopType).isRequired,
    mapOptions: PropTypes.objectOf(MapOptions).isRequired,
};

export default RouteMap;
