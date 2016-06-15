var Similarity = require('string-score');
var _ = require('lodash');


var Pizza = function Constructor() {
	this.matchKeys = ['order pizza'];

};


Pizza.prototype.matchScore = function(msg, userData) {
	var scoreList = _.map(this.matchKeys, function(el){
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};

Pizza.prototype.solve = function(msg, response, dfd, userData) {
	response.setMsg(userData.name +" Noted! I'll let you know if the pizza is ready!!!");
	dfd.resolve(response);
};

module.exports = Pizza;