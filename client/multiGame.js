import {Application} from 'pixi.js';
import {BaseGameObject as GameObject} from './gameObject/BaseGameObject';
import {NetLevelBehavior} from './behavior/NetLevelBehavior';
import {config} from './config';

window.game = function (container) {
    const app = new Application(
        config.screenBounds.width,
        config.screenBounds.height, {
            antialias: true,
            backgroundColor: config.backgroundColor
        }
    );
    container.appendChild(app.view);

    const multiLevel = new GameObject([
        new NetLevelBehavior()
    ]);
    app.stage.addChild(multiLevel);
};
