'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');
var $ = require('jquery');
var brain = require('../brain/gubot-brain');

var GuBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'gubot';
    this.dbPath = settings.dbPath || path.resolve(process.cwd(), 'data', 'GuBot.db');

    this.mybrain = new brain({replyfn : this._reply});

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(GuBot, Bot);

module.exports = GuBot;


GuBot.prototype.run = function () {
    GuBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

GuBot.prototype._onStart = function() {
	this._loadBotUser();
};

GuBot.prototype._loadBotUser = function () {
    var self = this;
    
	this.user = this.users.filter(function (user) {
	    return user.name === self.name;
	})[0];

	if(!this['user']) {
		//console.log('unable to find my name, ba byeeeee......')
		process.exit(1);
	}
};

GuBot.prototype._onMessage = function(message){
	if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromGuBot(message) &&
        this._isMentioningGuBot(message)
    ) {
    	if(this.mybrain) {
    		var userData = this._getUserById(message.user);
			var result = this.mybrain.decide(message, userData);
			var self = this;
			result.then(function(msg){
				self._reply(msg);
			});
    	} else {
    		//console.log('my brain is empty :(');
    		process.exit(1);
    	}
    }
};

GuBot.prototype._getUserById = function(user){
	//console.log("I'm talking to " + user);
	return this.users.filter(function (el) {
	    return el.id === user;
	})[0];
};

GuBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

GuBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C';
};

GuBot.prototype._isFromGuBot = function (message) {
    return message.user === this.user.id;
};

GuBot.prototype._isMentioningGuBot = function (message) {
    return message.text.toLowerCase().indexOf('GuBot') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

GuBot.prototype._reply = function (msg) {
    var self = this;
    var channel = self._getChannelById(msg.channel);
    self.postMessageToChannel(channel.name, msg.response , {as_user: true});
};

GuBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};