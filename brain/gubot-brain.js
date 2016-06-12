var $ = require('jquery');
var Q = require('q');
var Msg = require('../lib/msg');
var DecisionMaker = require('./gubot-brain-decide');

var msgMgr = new Msg();

var GuBotBrain = function Constructor(params) {
	this.decisionMaker = new DecisionMaker();
};

GuBotBrain.prototype.decide = function(msg, userData){
	var dfd = Q.defer();
	var response = msgMgr.compose(msg);

	// Making Decision
	this.decisionMaker.decide(msg, response, dfd, userData);

	// Return promise, we are deciding
	return dfd.promise;
};


module.exports = GuBotBrain;
