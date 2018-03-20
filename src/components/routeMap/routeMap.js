import React from "react";
import PropTypes from "prop-types";
import MapImage from "components/map/mapImageContainer";
import ItemContainer from "components/labelPlacement/itemContainer";
import ItemFixed from "components/labelPlacement/itemFixed";
import ItemPositioned from "components/labelPlacement/itemPositioned";

import TerminalSymbol from "./terminalSymbol";
import TerminusSymbol from "./terminusSymbol";
import TerminusLabel from "./terminusLabel";
import IntermediateLabel from "./intermediateLabel";
import StationName from "./stationName";

import styles from "./routeMap.css";

const TERMINUS_SIZE = 5;
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
                    components={props.mapComponents}
                    date={props.date}
                />
            </div>
            <div className={styles.overlays}>
                <ItemContainer mapOptions={props.mapOptions} mapComponents={props.mapComponents}>
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
                    { props.projectedIntermediates.map((intermediate, index) => (
                        <ItemPositioned
                            key={index}
                            x={intermediate.x}
                            y={intermediate.y}
                            distance={4}
                            allowHidden
                            angle={intermediate.angle}
                        >
                            <IntermediateLabel
                                label={intermediate.label}
                            />
                        </ItemPositioned>
                    ))}
                    {props.projectedTerminuses.map((terminus, index) => (
                        <ItemPositioned
                            key={index}
                            x={terminus.x}
                            y={terminus.y}
                            distance={10}
                            angle={45}
                            priority={2}
                        >
                            <TerminusLabel
                                lines={terminus.lines}
                                nameFi={terminus.nameFi}
                                nameSe={terminus.nameSe}
                            />
                        </ItemPositioned>
                    ))}
                    {props.projectedTerminalNames.map((name, index) => (
                        <ItemPositioned
                            key={index}
                            x={name.x}
                            y={name.y}
                            distance={10}
                            angle={45}
                            priority={3}
                        >
                            <StationName
                                nameFi={name.nameFi}
                                type={name.type}
                            />
                        </ItemPositioned>
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
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    nameFi: PropTypes.string,
    nameSe: PropTypes.string,
});

const TerminalType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    nameFi: PropTypes.string,
    nameSv: PropTypes.string,
    node: PropTypes.string.isRequired,
});

const IntermediateType = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
});

const MapOptions = PropTypes.shape({
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
});

const terminalName = PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    nameFi: PropTypes.string,
});

RouteMap.propTypes = {
    date: PropTypes.string.isRequired,
    projectedTerminals: PropTypes.arrayOf(TerminalType).isRequired,
    projectedTerminalNames: PropTypes.arrayOf(terminalName).isRequired,
    projectedTerminuses: PropTypes.arrayOf(TerminusType).isRequired,
    projectedIntermediates: PropTypes.arrayOf(IntermediateType).isRequired,
    mapOptions: PropTypes.objectOf(MapOptions).isRequired,
    mapComponents: PropTypes.object.isRequired, // eslint-disable-line
};

export default RouteMap;
