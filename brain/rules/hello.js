var HelloWord = require('../speech/words/hello');
var Similarity = require('string-score');
var _ = require('lodash');


var HelloRule = function Constructor() {
	this.helloWordMgr = new HelloWord();
	this.matchKeys = ['hello', 'sawaddee'];
};

HelloRule.prototype.matchScore = function(msg, userData) {
	//console.log('Mapping to score-based');
	var scoreList = _.map(this.matchKeys, function(el){
		//console.log('Calculating Similarity score for "' + el + '"');
		return Similarity(msg.text, el);
	});
	return _.max(scoreList);
};


HelloRule.prototype.solve = function(msg, response, dfd, userData) {
	var wordToShow = this.helloWordMgr.getHelloWord(userData, Math.random() * 1000);
	response.setMsg(wordToShow);
	dfd.resolve(response);
};

module.exports = HelloRule;