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
        if (terminal1.x > terminal2.x) {
            result.x -= (terminal2.x - terminal1.x) + size;
        } else {
            result.x += (terminal1.x - terminal2.x) + size;
        }
    } else if (terminal1.y > terminal2.y) {
        result.y += (terminal2.y - terminal1.y) + size;
    } else {
        result.y -= (terminal1.y - terminal2.y) + size;
    }
    return result;
}

function preventFromOverlap(terminals, size) {
    const result = [];
    for (let i = 0; i < terminals.length; i++) {
        let terminal1 = terminals[i];
        for (let j = 0; j < terminals.length; j++) {
            const terminal2 = terminals[j];
            if (i !== j && doesOverlap(terminal1, terminal2, size)) {
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
