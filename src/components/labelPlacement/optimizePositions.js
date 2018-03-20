import updatePosition from "./updatePosition";
import { getIfOccupied } from "../../util/MapAlphaChannelMatrix";

import {
    hasOverflow,
    getOverflowCost,
    getOverlapArea,
    getOverlapCost,
    getDistanceCost,
    getIntersectionCost,
    getFixedIntersectionCost,
    getAngleCost,
    getAlphaOverflowCost,
    getPositionAlphaOverflowCost,
    getPositionOverlapCost,
    getPositionFixedIntersectionCost,
} from "./costFunctions";


const timeout = 60 * 60 * 1000;
const iterationsPerFactor = 10;

const angles = [-32, -16, -8, -4, -1, 0, 1, 4, 8, 16, 32];
const distances = [-25, -10, -1, 0, 1, 10, 25];
const factors = [5, 3, 2, 1];

const diffsArray = factors.map(factor => (
    angles.reduce((prev, angle) => ([
        ...prev,
        ...distances.map(distance => ({ angle: angle * factor, distance: distance * factor })),
    ]), [])
));

function getCost(placement, bbox, alphaByteArray) {
    const { positions, indexes } = placement;
    const overflow = getOverflowCost(positions, indexes, bbox);
    const overlap = getOverlapCost(positions, indexes);
    const distance = getDistanceCost(positions, indexes);
    const angle = getAngleCost(positions, indexes);
    const intersection = getIntersectionCost(positions, indexes);
    const intersectionWithFixed = getFixedIntersectionCost(positions, indexes);
    const alphaOverlap = getAlphaOverflowCost(positions, indexes, alphaByteArray);
    return overflow
        + overlap
        + distance
        + angle
        + intersection
        + intersectionWithFixed
        + alphaOverlap;
}

function getOverlappingItem(placement, indexToOverlap) {
    const { positions } = placement;
    for (let i = 0; i < positions.length; i++) {
        if (i !== indexToOverlap && !positions[i].isFixed &&
            getOverlapArea(positions[i], positions[indexToOverlap]) > 0) {
            return i;
        }
    }
    return null;
}

function getPlacements(placement, index, diffs, bbox) {
    const { positions, indexes } = placement;

    return diffs
        .map((diff) => {
            const updatedPosition = updatePosition(positions[index], diff);
            if (!updatedPosition || hasOverflow(updatedPosition, bbox)) {
                return null;
            }
            return positions.map((position, i) => ((i === index) ? updatedPosition : position));
        })
        .filter(updatedPositions => !!updatedPositions)
        .map(updatedPositions => ({ positions: updatedPositions, indexes: [...indexes, index] }));
}

function comparePlacements(placement, other, bbox, alphaByteArray) {
    const indexes = [...new Set([...placement.indexes, ...other.indexes])];
    const cost = getCost({ ...placement, indexes }, bbox, alphaByteArray);
    const costOther = getCost({ ...other, indexes }, bbox, alphaByteArray);
    return costOther < cost ? other : placement;
}

function getNextPlacement(initialPlacement, index, diffs, bbox, alphaByteArray) {
    // Get potential positions for item at index
    const placements = getPlacements({ ...initialPlacement, indexes: [] }, index, diffs, bbox);

    // Get positions where one overlapping item is updated as well
    const placementsOverlapping = placements.reduce((prev, placement) => {
        const overlapIndex = getOverlappingItem(placement, index);
        if (!overlapIndex) return prev;
        return [...prev, ...getPlacements(placement, overlapIndex, diffs, bbox)];
    }, []);

    const nextPlacement = [
        initialPlacement,
        ...placements,
        ...placementsOverlapping,
    ].reduce((prev, cur) => comparePlacements(prev, cur, bbox, alphaByteArray));

    return nextPlacement;
}

function findMostSuitablePosition(initialPlacement, bbox, isOccupied) {
    const start = Date.now();
    let placement = initialPlacement;
    const iter = factors.length * iterationsPerFactor * placement.positions.length;
    let counter = 0;
    for (let factor = 0; factor < factors.length; factor++) {
        const diffs = diffsArray[factor];
        for (let iteration = 0; iteration < iterationsPerFactor; iteration++) {
            console.log(`${counter}/${iter}`); // eslint-disable-line
            const previous = placement;
            for (let index = 0; index < placement.positions.length; index++) {
                counter++;
                if (!placement.positions[index].isFixed) {
                    placement = getNextPlacement(placement, index, diffs, bbox, isOccupied);
                }
                if ((Date.now() - start) > timeout) {
                    console.log("Timeout"); // eslint-disable-line
                    return placement.positions;
                }
            }
            if (placement === previous) {
                break;
            }
        }
    }
    return placement.positions;
}

function optimizePositions(initialPositions, bbox, alphaByteArray, mapOptions) {
    const placement = {
        positions: initialPositions.map(position => updatePosition(position)),
        indexes: [],
    };

    const isOccupied = getIfOccupied(alphaByteArray, mapOptions);

    const positions = findMostSuitablePosition(placement, bbox, isOccupied);

    const newPlacements = [];
    positions.forEach((position, index) => {
        const score = getPositionAlphaOverflowCost(position, isOccupied);
        const distance = position.distance - position.initialDistance;

        const indexes = (new Int8Array(positions.length))
            .map((_, i) => i)
            .filter(i => i !== index);
        const overlap =
            getPositionOverlapCost(positions, indexes, index, true);
        const fixedOverlap =
            getPositionFixedIntersectionCost(positions, indexes, index);

        newPlacements.push({
            ...position,
            visible: score < 10 && distance < 200 && overlap === 0 && fixedOverlap === 0,
        });
    });
    return newPlacements;
}

export default optimizePositions;
