'use strict';

const COLOR_VALUES = 5;
const GRIS_SIZE = 10;
const cells = new Array(GRIS_SIZE * GRIS_SIZE);

for (let i = 0; i < GRIS_SIZE * GRIS_SIZE; i++) {
    cells[i] = Math.floor(Math.random() * COLOR_VALUES);
}

module.exports.getAll = function () {
    return cells;
};

module.exports.setNextColor = function (index) {
    if (index < cells.length) {
        const colorIndex = (cells[index] + 1) % COLOR_VALUES;
        cells[index] = colorIndex;
        return colorIndex;
    }
    return '';
};
