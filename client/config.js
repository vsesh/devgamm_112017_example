import {Rectangle} from 'pixi.js';

// TODO конфиг должен быть общим с сервером

const config = {
    backgroundColor: 0xFFFFFF,

    selfPlayer: {
        fillOpacity: 1,
        fillColor: 0x242424,
        radius: 6
    },
    anotherPlayer: {
        fillOpacity: 0.6,
        fillColor: 0x242424,
        radius: 3
    },

    cell: {
        fillOpacity: 0.7,
        fillColor: 0xFF0000,
        radius: 20
    },

    playerSpeed: 8,

    screenBounds: new Rectangle(0, 0, 800, 800),

    backendUrl: 'ws://localhost:3031/ws',

    cellColors: [
        '0xD37878',
        '0xD3C778',
        '0x78D378',
        '0x78D3CC',
        '0x787ED3'
    ],

    gridSize: 10
};

export {config};
