'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const expressWs = require('express-ws');
const netGame = require('./lib/net-game');

const app = express();
expressWs(app);

app
    .use('/ping', (req, res) => {
        res.sendStatus(200);
    })
    .use('/', serveStatic(__dirname + '/../dist/'))
    .ws('/ws', netGame)
    .use((req, res) => {
        res.sendStatus(404);
    })
    .use((err, req, res) => {
        res.sendStatus(500);
    });

app.listen(3031);
