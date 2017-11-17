import {BaseLevelBehavior} from './BaseLevelBehavior';
import {PlayerBehavior} from './PlayerBehavior';

import {CircleGameObject} from '../gameObject/CircleGameObject';

import {config} from '../config';

class NetLevelBehavior extends BaseLevelBehavior {
    _geoObjectAdded() {
        super._geoObjectAdded();
        this._openConnection();
    }

    _geoObjectRemoved() {
        super._geoObjectRemoved();
        this._closeConnection();
    }

    _openConnection() {
        this._anotherPlayers = {};
        this._cell = [];

        this._actions = {
            init: this._initHandler,
            playerAdded: this._playerAddedHandler,
            playerRemoved: this._playerRemovedHandler,
            playerUpdated: this._playerUpdatedHandler,
            cellUpdated: this._cellUpdatedHandler
        };

        this._socket = new WebSocket(config.backendUrl);

        this._socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (this._actions[message.type]) {
                this._actions[message.type].call(this, message.eventData);
            }
        });

        this._socket.addEventListener('close', () => {
            console.log('connection lost');
            this._socket = null;
        });
    }

    _closeConnection() {
        this._socket.close();
    }

    _initHandler(initData) {
        // Добавляем сетку
        initData.grid.forEach((colorIndex, index) => {
            const baseX = (index % config.gridSize);
            const baseY = Math.floor(index / config.gridSize);
            const cell = this._createCell(
                baseX * (config.screenBounds.width / config.gridSize),
                baseY * (config.screenBounds.height / config.gridSize),
                Object.assign({}, config.cell, {
                    fillColor: config.cellColors[colorIndex]
                })
            );
            this._cell[index] = cell;
        }, this);

        this._cellHolder.x = (config.screenBounds.width - this._cellHolder.width);
        this._cellHolder.y = (config.screenBounds.height - this._cellHolder.height);

        // Добавляем других игроков
        initData.players.forEach(this._playerAddedHandler, this);

        // Добавляем себя
        this._playerBehavior = new PlayerBehavior();
        this._player = new CircleGameObject([this._playerBehavior], config.selfPlayer);
        this._player.x = initData.state.x;
        this._player.y = initData.state.y;
        this._gameObject.addChild(this._player);

        // Подписка на события игрока
        this._playerBehavior
            .on('positionChanged', (event) => {
                this._i = 0;
                this._sendMessage('updatePosition', {
                    x: event.x,
                    y: event.y
                });
            }, this)
            .on('fire', () => {
                const index = this._cell.indexOf(this._selectedCell);
                if (index > -1) {
                    this._sendMessage('switchColor', {
                        index: index
                    });
                }
            }, this);
    }

    _playerAddedHandler(newPlayerData) {
        const playerData = config.anotherPlayer;
        const player = new CircleGameObject([], playerData);
        player.x = newPlayerData.x;
        player.y = newPlayerData.y;
        this._gameObject.addChild(player);
        this._anotherPlayers[newPlayerData.id] = player;
    }

    _playerRemovedHandler(playerData) {
        if (this._anotherPlayers[playerData.id]) {
            const player = this._anotherPlayers[playerData.id];
            this._gameObject.removeChild(player);
            delete this._anotherPlayers[playerData.id];
        }
    }

    _playerUpdatedHandler(playerData) {
        const player = this._anotherPlayers[playerData.id];
        // Обновляем положение другого игрока
        if (player) {
            player.x = playerData.x;
            player.y = playerData.y;
        }
    }

    _cellUpdatedHandler(cellData) {
        const cell = this._cell[cellData.index];
        if (cell) {
            cell.color = config.cellColors[cellData.colorIndex];
        }
    }

    _sendMessage(type, data) {
        if (this._socket) {
            this._socket.send(JSON.stringify({type, data}));
        } else {
            console.log('Sorry, Mario!');
        }
    }
}

export {NetLevelBehavior};
