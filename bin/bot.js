'use strict';

var GuBoT = require('../bot/gubot');

var token = process.env.BOT_API_KEY;
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var gubot = new GuBoT({
    token: token,
    dbPath: dbPath,
    name: name
});

gubot.run();