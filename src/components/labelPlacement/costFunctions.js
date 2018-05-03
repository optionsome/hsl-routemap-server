import segseg from "segseg";

const OVERLAP_COST = 20;
const OVERLAP_COST_FIXED = 6;
const OVERFLOW_COST = 10;
const INTERSECTION_COST = 1000;
const INTERSECTION_WITH_FIXED_COST = 25;
const DISTANCE_COST = 60;
const ANGLE_COST = 1;
const ALPHA_COST = 1500;

const ALPHA_STEP = 5;

function hasOverflow(position, boundingBox) {
    return position.left < 0 || position.top < 0 ||
          (position.left + position.width) > boundingBox.width ||
          (position.top + position.height) > boundingBox.height;
}

function getOverflowCost(positions, indexes, boundingBox) {
    return OVERFLOW_COST * indexes.reduce((prev, index) =>
        (hasOverflow(positions[index], boundingBox) ? (prev + 1) : prev), 0);
}

function getPositionAlphaOverflowCost(position, isOccupied) {
    let overlapCounter = 0;
    for (let { left } = position; left < (position.left + position.width); left += ALPHA_STEP) {
        for (
            let { top } = position;
            top < (position.top + position.height);
            top += ALPHA_STEP) {
            if (isOccupied(left, top)) overlapCounter++;
        }
    }
    return overlapCounter * position.alphaOverlapPriority;
}

function getAlphaOverflowCost(positions, indexes, isOccupied) {
    return positions.map(position => getPositionAlphaOverflowCost(position, isOccupied))
        .reduce((a, b) => a + b) * ALPHA_COST;
}

/**
 * Returns intersection area of two items
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
function getOverlapArea(a, b) {
    const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
    const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
    return Math.max(0, width) * Math.max(0, height);
}

function getPositionOverlapCost(positions, indexes, i, runAll) {
    let overlap = 0;
    indexes.forEach((j) => {
        if (j >= i && indexes.includes(i) && !runAll) return;
        const area = getOverlapArea(positions[i], positions[j]);
        const isFixed = positions[i].isFixed || positions[j].isFixed;
        overlap += area * (isFixed ? OVERLAP_COST_FIXED : OVERLAP_COST);
    });
    return overlap;
}

/**
 * Returns cost for overlapping non-fixed items
 * @param {Object[]} positions - Positions
 * @param {number[]} indexes - Indexes to check
 * @returns {number}
 */
function getOverlapCost(positions, indexes) {
    let overlap = 0;
    positions.forEach((position, i) => {
        overlap += getPositionOverlapCost(positions, indexes, i);
    });
    return overlap;
}

/**
 * Returns true if line of items a and b intersect
 * @param {Object} a
 * @param {Object} b
 * @param {boolean}
 */
function hasIntersectingLines(a, b) {
    return !!segseg(a.x, a.y, a.x + a.cx, a.y + a.cy, b.x, b.y, b.x + b.cx, b.y + b.cy);
}

/**
 * Returns cost for intersecting lines from anchor to item
 * @param {Object[]} positions - Positions
 * @param {number[]} indexes - Indexes to check
 * @returns {number}
 */
function getIntersectionCost(positions, indexes) {
    let sum = 0;
    positions.forEach((position, i) => {
        if (position.isFixed) return;
        indexes.forEach((j) => {
            if (positions[j].isFixed) return;
            if (j >= i && indexes.includes(i)) return;
            if (hasIntersectingLines(position, positions[j])) sum += 1;
        });
    });
    return sum * INTERSECTION_COST;
}

function getPositionFixedIntersectionCost(positions, indexes, index) {
    let sum = 0;
    const position = positions[index];
    indexes.forEach((j) => {
        if (j >= index && indexes.includes(index)) return;
        // If both are dynamic or fixed, return
        if (position.isFixed === positions[j].isFixed) return;
        const a = !position.isFixed ? position : positions[j];
        const b = position.isFixed ? position : positions[j];

        const a0 = [a.x, a.y];
        const a1 = [a.x + a.cx, a.y + a.cy];

        const tl = [b.left, b.top];
        const tr = [b.left + b.width, b.top];
        const bl = [b.left, b.top + b.height];
        const br = [b.left + b.width, b.top + b.height];

        const p1 = segseg(a0, a1, tl, tr);
        const p2 = segseg(a0, a1, tl, bl);
        const p3 = segseg(a0, a1, bl, br);
        const p4 = segseg(a0, a1, tr, br);

        const intersections = ([p1, p2, p3, p4]).filter(p => Array.isArray(p));

        if (intersections.length === 2) {
            const dx = intersections[0][0] - intersections[1][0];
            const dy = intersections[0][1] - intersections[1][1];

            sum += Math.sqrt((dx ** 2) + (dy ** 2));
        }
    });
    return sum;
}

/**
 * Returns cost for intersected areas with fixed items
 * @param {Object[]} positions - Positions
 * @param {number[]} indexes - Indexes to check
 * @returns {number}
 */
function getFixedIntersectionCost(positions, indexes) {
    let sum = 0;
    positions.forEach((position, i) => {
        sum +=
            getPositionFixedIntersectionCost(positions, indexes, i)
            * (position.lineOverlapPriority);
    });
    return sum * INTERSECTION_WITH_FIXED_COST;
}

/**
 * Returns cost for increased distances from anchor
 * @param {Object[]} positions - Positions
 * @param {number[]} indexes - Indexes to check
 * @returns {number}
 */
function getDistanceCost(positions, indexes) {
    return DISTANCE_COST * indexes.reduce((prev, index) =>
        prev
        + (
            Math.log2(Math.max((positions[index].distance - positions[index].initialDistance), 1)
                * positions[index].distancePriority)
        ), 0);
}

/**
 * Returns cost for increased angle compared to initial angle
 * @param {Object[]} positions - Positions
 * @param {number[]} indexes - Indexes to check
 * @returns {number}
 */
function getAngleCost(positions, indexes) {
    return ANGLE_COST * indexes.reduce((prev, index) => {
        const phi = Math.abs(positions[index].angle - positions[index].initialAngle) % 180;
        return prev + (((phi > 90) ? 180 - phi : phi) * positions[index].anglePriority);
    }, 0);
}

export {
    hasOverflow,
    getOverflowCost,
    getOverlapArea,
    getOverlapCost,
    hasIntersectingLines,
    getIntersectionCost,
    getFixedIntersectionCost,
    getDistanceCost,
    getAngleCost,
    getAlphaOverflowCost,
    getPositionAlphaOverflowCost,
    getPositionOverlapCost,
    getPositionFixedIntersectionCost,
};
