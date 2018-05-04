/* eslint-disable no-restricted-globals */

import optimizePositions from "./optimizePositions";

self.addEventListener("message", (event) => {
    const {
        positions, boundingBox, alphaByteArray, mapOptions, configuration,
    } = event.data;
    const optimizedPositions =
        optimizePositions(positions, boundingBox, alphaByteArray, mapOptions, configuration);

    self.postMessage(optimizedPositions);
});
