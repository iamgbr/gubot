var Similarity = require('string-score');
var _ = require('lodash');


var HELLOWORLDSERVICE = function Constructor() {

	this.matchKeys = [];
};


HELLOWORLDSERVICE.prototype.matchScore = function(msg, userData) {
	var scoreList = _.map(this.matchKeys, function(el){
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};

HELLOWORLDSERVICE.prototype.solve = function(msg, response, dfd, userData) {

};

module.exports = HELLOWORLDSERVICE;