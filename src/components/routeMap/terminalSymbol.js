import React from "react";
import PropTypes from "prop-types";

import { InlineSVG } from "components/util";

import SubwayIcon from "icons/icon_subway.svg";
import BusIcon from "icons/icon_bus.svg";
import FerryIcon from "icons/icon_ferry.svg";
import RailIcon from "icons/icon_rail.svg";
import TramIcon from "icons/icon_tram.svg";
import TrunkIcon from "icons/icon_trunk.svg";

import styles from "./terminalSymbol.css";

function getIcon(node) {
    switch (node) {
    case "SUBWAY":
        return SubwayIcon;
    case "BUS":
        return BusIcon;
    case "FERRY":
        return FerryIcon;
    case "RAIL":
        return RailIcon;
    case "TRAM":
        return TramIcon;
    case "TRUNK":
        return TrunkIcon;
    default:
        return null;
    }
}

const TerminalSymbol = (props) => {
    const icon = getIcon(props.node);

    return (
        icon && <InlineSVG src={icon} className={styles.root}/>
    );
};

TerminalSymbol.propTypes = {
    nodes: PropTypes.string.isRequired,
};

export default TerminalSymbol;
