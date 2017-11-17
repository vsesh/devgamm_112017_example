'use strict';

const grid = require('./grid');

// TODO хорошо бы это в общий конфиг перенести
const STAGE_SIZE = {
    width: 800,
    height: 800
};

const players = new Map();
let id = 0;

const actions = {
    updatePosition: playerUpdate,
    switchColor: switchColor
};

module.exports = function (player) {
    createNewPlayer(player);

    player.on('close', () => {
        removePlayer(player);
    });

    player.on('message', (data) => {
        const messageData = JSON.parse(data);
        // Пока единственное сообщение от клиента - обновление своего состояния
        if (actions[messageData.type]) {
            actions[messageData.type](player, messageData.data);
        }
    });
};

function createNewPlayer(player) {
    // Создание состояния игрока
    const playerState = {
        id: ++id,
        x: STAGE_SIZE.width * Math.random(),
        y: STAGE_SIZE.height * Math.random()
    };
    // Отправляем информацию новому игроку
    sendMessage(player, 'init', {
        state: playerState,
        players: Array.from(players.values()),
        grid: grid.getAll()
    });
    // Регистрируем нового игрока
    players.set(player, playerState);
    // Отправляем информацию о новом игроке всем остальным игрокам
    callAllPlayers('playerAdded', playerState, player);
}

function playerUpdate(player, newState) {
    const state = players.get(player);
    // Обновление состояния игрока
    state.x = newState.x;
    state.y = newState.y;
    // Уведомление всех остальных игроков
    callAllPlayers('playerUpdated', state, player);
}

function switchColor(player, data) {
    // Переключение света
    const newIndex = grid.setNextColor(data.index);
    // Отправка нового цвета всем клиентам
    callAllPlayers('cellUpdated', {
        index: data.index,
        colorIndex: newIndex
    });
}

function removePlayer(player) {
    const state = players.get(player);
    // Удаляем игрока
    players.delete(player);
    // и уведомляем всех остальных
    callAllPlayers('playerRemoved', state);
}

function callAllPlayers(eventType, eventData, exclude) {
    for (const player of players.keys()) {
        // Отправляем событие всем игрокам кроме определенного
        if (!exclude || player !== exclude) {
            sendMessage(player, eventType, eventData);
        }
    }
}

function sendMessage(player, type, eventData) {
    // Непосредственная отправка данных
    player.send(
        JSON.stringify({type, eventData})
    );
}
