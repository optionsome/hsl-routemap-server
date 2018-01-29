import React from "react";

import MapImage from "components/map/mapImageContainer";
import ItemContainer from "components/labelPlacement/itemContainer";
import ItemFixed from "components/labelPlacement/itemFixed";
import ItemPositioned from "../labelPlacement/itemPositioned";
import StopSymbol from "../map/stopSymbol";


import styles from "./routeMap.css";

const RouteMap = () => (
    <div className={styles.root}>
        <div className={styles.map}>
            <MapImage
                options={{
                    center: [24.763964, 60.170899],
                    zoom: 12,
                    width: 400,
                    height: 400,
                    scale: 5,
                }}
                components={{
                    text_fisv: { enabled: true },
                    routes: { enabled: true },
                    stops: { enabled: true },
                    print: { enabled: true },
                    municipal_borders: { enabled: true },
                }}
                date="2018-01-15"
            />
        </div>
        <div className={styles.overlays}>
            <ItemContainer>
                <ItemFixed
                    top={200}
                    left={200}
                >
                    <StopSymbol routes={[{ routeId: "1234", mode: "BUS" }]} size={10 * 2}/>
                </ItemFixed>
                <ItemPositioned
                    key="1234"
                    x={300}
                    y={300}
                    distance={25}
                    angle={0}
                >
                    <StopSymbol routes={[{ routeId: "1234", mode: "BUS" }]} size={10 * 2}/>
                </ItemPositioned>
            </ItemContainer>
        </div>
    </div>
);

RouteMap.defaultProps = {
};

RouteMap.propTypes = {
};

export default RouteMap;
