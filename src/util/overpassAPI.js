export default function getStations(minLat, minLon, maxLat, maxLon) {
    return fetch(
        "https://lz4.overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: `[out:json];node[railway=station](${minLat},${minLon},${maxLat},${maxLon});out;`,
            "Content-Type": "application/osm3+xml",
        }
    ).then(response => response.json());
}
