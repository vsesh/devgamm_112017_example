import {ticker as tickerNS} from 'pixi.js';

let ticker;
function getTicker() {
    if (!ticker) {
        ticker = new tickerNS.Ticker();
        ticker.start();
    }
    return ticker;
}

export {getTicker};
