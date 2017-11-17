import {Graphics} from 'pixi.js';
import {BaseGameObject} from './BaseGameObject';

class CircleGameObject extends BaseGameObject {
    constructor(behaviors, options) {
        super(behaviors);
        this._color = options.fillColor;
        this._radius = options.radius || 6;
        this._redraw();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this._redraw();
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
        this._redraw();
    }

    _redraw() {
        if (this._graphics) {
            this.removeChild(this._graphics);
        }
        this._graphics = new Graphics();
        // this._graphics.beginFill(this._color, options.fillOpacity || 1);
        // this._graphics.lineStyle(options.lineWidth || 0, options.lineColor);
        // this._graphics.arc(0, 0, this._radius, 0, Math.PI * 2);
        // this._graphics.endFill();
        this._graphics.beginFill(this._color, 1);
        this._graphics.drawCircle(0, 0, this._radius);
        this._graphics.endFill();
        this.addChild(this._graphics);
    }
}

export {CircleGameObject};
