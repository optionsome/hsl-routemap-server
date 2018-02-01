import React from "react";
import PropTypes from "prop-types";
import MapImage from "components/map/mapImageContainer";
import ItemContainer from "components/labelPlacement/itemContainer";
import ItemFixed from "components/labelPlacement/itemFixed";
import TerminalSymbol from "./terminalSymbol";

import styles from "./routeMap.css";

const STOP_RADIUS = 12;

const RouteMap = (props) => {
    const positionedTerminals = props.projectedTerminals;

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
                    {positionedTerminals.map((terminal, index) => (
                        <ItemFixed
                            key={index}
                            top={terminal.y - STOP_RADIUS}
                            left={terminal.x - STOP_RADIUS}
                        >
                            <TerminalSymbol
                                nameFi={terminal.nameFi}
                                nameSv={terminal.nameSe}
                                node={terminal.node}
                            />
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
    nameFi: PropTypes.string.isRequired,
    nameSv: PropTypes.string,
    node: PropTypes.string.isRequired,
});

const MapOptions = PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
});

RouteMap.propTypes = {
    date: PropTypes.string.isRequired,
    projectedTerminals: PropTypes.arrayOf(StopType).isRequired,
    mapOptions: PropTypes.objectOf(MapOptions).isRequired,
};

export default RouteMap;
