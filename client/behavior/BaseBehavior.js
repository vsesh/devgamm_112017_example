import {getTicker} from '../util';

import {utils} from 'pixi.js';

class BaseBehavior extends utils.EventEmitter {
    setGameObject(gameObject) {
        if (this._gameObject) {
            this._geoObjectRemoved();
        }
        this._gameObject = gameObject;
        if (this._gameObject) {
            this._geoObjectAdded();
        }
    }

    _geoObjectAdded() {
        this._gameObject.on('removed', this._removedEventHandler, this);
        getTicker().add(this._tickHandler, this);
    }

    _geoObjectRemoved() {
        this._gameObject.off('removed', this._removedEventHandler, this);
        getTicker().remove(this._tickHandler, this);
    }

    _tickHandler() {}

    _removedEventHandler() {
        this.setGameObject(null);
    }
}

export {BaseBehavior};
