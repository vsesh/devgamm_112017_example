import {BaseBehavior} from './BaseBehavior';

import {config} from '../config';

class PlayerBehavior extends BaseBehavior {
    _geoObjectAdded() {
        super._geoObjectAdded();
        this._createDomEventListeners();
    }

    _geoObjectRemoved() {
        super._geoObjectRemoved();
        this._removeDomEventListeners();
    }

    _tickHandler() {
        if (this._direction.x || this._direction.y) {
            this._gameObject.x += this._direction.x * config.playerSpeed;
            this._gameObject.y += this._direction.y * config.playerSpeed;
            this.emit('positionChanged', {
                x: this._gameObject.x,
                y: this._gameObject.y
            });
        }
    }

    _createDomEventListeners() {
        this._keysActions = {
            // space
            32: function (event) {
                if (event.type === 'keyup') {
                    this.emit('fire');
                }
            },
            // left
            37: function (event) {
                this._arrowKeyHandler(event, 'x', -1);
            },
            // right
            39: function (event) {
                this._arrowKeyHandler(event, 'x', 1);
            },
            // up
            38: function (event) {
                this._arrowKeyHandler(event, 'y', -1);
            },
            // down
            40: function (event) {
                this._arrowKeyHandler(event, 'y', 1);
            }
        };
        this._direction = {
            x: 0,
            y: 0
        };
        this._eventHandler = this._eventListener.bind(this);
        document.addEventListener('keydown', this._eventHandler);
        document.addEventListener('keyup', this._eventHandler);
    }

    _removeDomEventListeners() {
        document.removeEventListener('keydown', this._eventHandler);
        document.removeEventListener('keyup', this._eventHandler);
    }

    _eventListener(event) {
        if (this._keysActions[event.keyCode]) {
            this._keysActions[event.keyCode].call(this, event);
        }
    }

    _arrowKeyHandler(event, axis, value) {
        if (event.type === 'keydown' && !this._direction[axis]) {
            this._direction[axis] = value;
        } else if (event.type === 'keyup' && this._direction[axis] === value) {
            this._direction[axis] = 0;
        }
    }
}

export {PlayerBehavior};
