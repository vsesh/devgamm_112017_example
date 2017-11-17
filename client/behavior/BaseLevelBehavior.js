import {BaseBehavior} from './BaseBehavior';

import {CircleGameObject} from '../gameObject/CircleGameObject';

import {Container} from 'pixi.js';

class BaseLevelBehavior extends BaseBehavior {
    _geoObjectAdded() {
        super._geoObjectAdded();
        this._cellHolder = new Container();
        this._gameObject.addChild(this._cellHolder);
    }

    _geoObjectRemoved() {
        super._geoObjectRemoved();
        if (this._cellHolder) {
            this._gameObject.removeChild(this._cellHolder);
            this._cellHolder = null;
        }
    }

    _tickHandler() {
        const children = this._cellHolder.children;
        for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (this._player && this._checkCollision(this._player, child)) {
                this._collisionHandler(child);
                return;
            }
        }
        this._selectedCell = null;
    }

    _createCell(x, y, params) {
        const cell = new CircleGameObject([], params);
        cell.x = x;
        cell.y = y;
        this._cellHolder.addChild(cell);
        return cell;
    }

    _checkCollision(player, cell) {
        const dx = player.x - (cell.x + this._cellHolder.x);
        const dy = player.y - (cell.y + this._cellHolder.y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return (distance < player.radius + cell.radius);
    }

    _collisionHandler(cell) {
        this._selectedCell = cell;
    }
}

export {BaseLevelBehavior};
