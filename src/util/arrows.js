function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function getTransformedCoord(x, y, angle, distance) {
  const xDiff = Math.sin(toRadians(angle)) * distance;
  const yDiff = Math.cos(toRadians(angle)) * distance;
  return { transformedX: x + xDiff, transformedY: y - yDiff };
}

export {
  getTransformedCoord, // eslint-disable-line
};
