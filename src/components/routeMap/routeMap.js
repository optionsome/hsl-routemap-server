import React from "react";

import MapImage from "components/map/mapImageContainer";

// import PropTypes from "prop-types";

const RouteMap = () => (
    <div>
        <MapImage
            options={{
                center: [24.7068913, 60.1950766],
                zoom: 12,
                width: 1200,
                height: 1800,
                scale: 15,
            }}
            components={{
                text_fisv: { enabled: true },
                routes: { enabled: true },
                citybikes: { enabled: false },
                print: { enabled: true },
                ticket_sales: { enabled: true },
                municipal_borders: { enabled: true },
            }}
            date="2018-01-15"
        />
    </div>
);

RouteMap.defaultProps = {
};

RouteMap.propTypes = {
};

export default RouteMap;
