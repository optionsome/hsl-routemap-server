import React from "react";
import PropTypes from "prop-types";
import MapImage from "components/map/mapImageContainer";
import ItemContainer from "components/labelPlacement/itemContainer";
import ItemFixed from "components/labelPlacement/itemFixed";

import TerminalSymbol from "./terminalSymbol";
import TerminusSymbol from "./terminusSymbol";
import StopSymbol from "./stopSymbol";

import styles from "./routeMap.css";

const STOP_DIAMETER = 5;
const TERMINUS_SIZE = 8;
const TERMINAL_SIZE = 14;

const RouteMap = (props) => {
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
                        municipal_borders: { enabled: true },
                    }}
                    date={props.date}
                />
            </div>
            <div className={styles.overlays}>
                <ItemContainer>
                    {props.projectedStops.map((stop, index) => (
                        <ItemFixed
                            key={index}
                            top={stop.y - (STOP_DIAMETER / 2)}
                            left={stop.x - (STOP_DIAMETER / 2)}
                        >
                            <StopSymbol size={STOP_DIAMETER}/>
                        </ItemFixed>
                    ))}
                    {props.projectedTerminuses.map((terminus, index) => (
                        <ItemFixed
                            key={index}
                            top={terminus.y - (TERMINUS_SIZE / 2)}
                            left={terminus.x - (TERMINUS_SIZE / 2)}
                        >
                            <TerminusSymbol
                                size={TERMINUS_SIZE}
                            />
                        </ItemFixed>
                    ))}
                    {props.projectedTerminals.map((terminal, index) => (
                        <ItemFixed
                            key={index}
                            top={terminal.y - (TERMINAL_SIZE / 2)}
                            left={terminal.x - (TERMINAL_SIZE / 2)}
                        >
                            <TerminalSymbol
                                nameFi={terminal.nameFi}
                                nameSv={terminal.nameSe}
                                node={terminal.node}
                                size={TERMINAL_SIZE}
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

const TerminusType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    line_id: PropTypes.arrayOf(PropTypes.string).isRequired,
});

const TerminalType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    nameFi: PropTypes.string.isRequired,
    nameSv: PropTypes.string,
    node: PropTypes.string.isRequired,
});

const StopType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
});

const MapOptions = PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
});

RouteMap.propTypes = {
    date: PropTypes.string.isRequired,
    projectedTerminals: PropTypes.arrayOf(TerminalType).isRequired,
    projectedStops: PropTypes.arrayOf(StopType).isRequired,
    projectedTerminuses: PropTypes.arrayOf(TerminusType).isRequired,
    mapOptions: PropTypes.objectOf(MapOptions).isRequired,
};

export default RouteMap;
