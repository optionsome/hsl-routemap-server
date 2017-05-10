import React from "react";

import { Image } from "components/util";

import busIcon from "icons/icon_bus.svg";
import tramIcon from "icons/icon_tram.svg";
import railIcon from "icons/icon_rail.svg";
import subwayIcon from "icons/icon_subway.svg";
import ferryIcon from "icons/icon_ferry.svg";

import styles from "./stop.css";

const ICONS = {
    BUS: busIcon,
    TRAM: tramIcon,
    RAIL: railIcon,
    SUBWAY: subwayIcon,
    FERRY: ferryIcon,
};

const Icon = props => (
    <Image {...props} style={{ height: "20px", marginLeft: "2px" }}/>
);

const Stop = props => (
    <div className={styles.stop}>
        <div className={styles.left}/>
        <div className={styles.separator}>
            <div className={styles.separatorTop}/>
            <div className={styles.separatorSymbol}/>
            <div
                className={styles.separatorBottom}
                style={{ visibility: props.isLast ? "hidden" : "visible" }}
            />
        </div>
        <div className={styles.right}>
            <div>
                <div className={styles.title}>{props.nameFi}</div>
                <div className={styles.subtitle}>{props.nameSe}</div>
            </div>
            {props.terminalByTerminalId && (
                <div className={styles.iconContainer}>
                    {props.terminalByTerminalId.siblings.nodes.map(sibling =>
                      sibling.modes.nodes
                          // Filter out bus terminals, until we have more specs how to handle those.
                          .filter(mode => mode !== "BUS")
                          .map(mode => <Icon src={ICONS[mode]}/>)
                    )}
                </div>
            )}
        </div>
    </div>
);

export default Stop;
