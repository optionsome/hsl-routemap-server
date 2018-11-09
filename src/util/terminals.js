function doesOverlap(terminal1, terminal2, size) {
  return (
    terminal1.x < terminal2.x + size &&
    terminal1.x + size > terminal2.x &&
    terminal1.y > terminal2.y - size &&
    terminal1.y - size < terminal2.y
  );
}

function removeOverlap(terminal1, terminal2, size) {
  const horDiff = Math.abs(terminal1.x - terminal2.x);
  const verDiff = Math.abs(terminal1.y - terminal2.y);
  const horFurther = horDiff > verDiff;
  const result = terminal1;
  if (horFurther) {
    if (terminal1.x < terminal2.x) {
      result.x -= size - (terminal2.x - terminal1.x);
    } else {
      result.x += size - (terminal1.x - terminal2.x);
    }
  } else if (terminal1.y > terminal2.y) {
    result.y += size - (terminal1.y - terminal2.y);
  } else {
    result.y -= size - (terminal1.y - terminal2.y);
  }
  return result;
}

function preventFromOverlap(terminals, size) {
  const result = [];
  const alreadyFixed = [];
  for (let i = 0; i < terminals.length; i++) {
    let terminal1 = terminals[i];
    for (let j = 0; j < terminals.length; j++) {
      const terminal2 = terminals[j];
      if (
        i !== j &&
        doesOverlap(terminal1, terminal2, size) &&
        alreadyFixed.indexOf(terminal2) === -1
      ) {
        alreadyFixed.push(terminal1);
        terminal1 = removeOverlap(terminal1, terminal2, size);
      }
    }
    result.push(terminal1);
  }
  return result;
}

export {
  preventFromOverlap, // eslint-disable-line
};
