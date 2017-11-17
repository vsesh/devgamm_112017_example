import {Container} from 'pixi.js';

class BaseGameObject extends Container {
    constructor(behaviors) {
        super();
        this.role = 'gameObject';
        behaviors.forEach((behavior) => {
            behavior.setGameObject(this);
        });
        this._behaviors = behaviors;
    }

    destroy() {
        this._behaviors.forEach((behavior) => {
            behavior.setGameObject(null);
        });
        this._behaviors.length = 0;
    }
}

export {BaseGameObject};
