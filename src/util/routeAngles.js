function getMostCommonAngle(angles) {
    return angles && angles[0];
}

function getAngleDiff(angle1, angle2) {
    const diff = angle1 - angle2;
    return Math.abs(((diff + 180) % 360) - 180);
}

function sum(a) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i];
    return s;
}

function degToRad(deg) {
    return (Math.PI / 180) * deg;
}

function meanAngleDeg(list) {
    return (180 / Math.PI) * Math.atan2(
        sum(list.map(degToRad).map(Math.sin)) / list.length,
        sum(list.map(degToRad).map(Math.cos)) / list.length
    );
}

function getOneDirectionalAngle(angles) {
    let biggestDiff = 0;
    angles.forEach((angle1) => {
        angles.forEach((angle2) => {
            if (angle1 !== angle2) {
                biggestDiff = Math.max(biggestDiff, getAngleDiff(angle1, angle2));
            }
        });
    });
    if (biggestDiff < 90) {
        return meanAngleDeg(angles);
    }
    return null;
}

export {
    getMostCommonAngle,
    getOneDirectionalAngle,
};
