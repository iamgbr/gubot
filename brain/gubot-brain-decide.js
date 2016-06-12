// Our own services
var HelloRule = require('./rules/hello');
var CheckVersion = require('./rules/checkVer');
var Forecast = require('./rules/forecast');
var AwesomeTranslator = require('./rules/translator');

// 3rd party APIs
var Similarity = require('string-score');
var _ = require('lodash');

var THRESHOLD_SCORE = 0.25;


var DecisionMaker = function Constructor(params) {
	this.initRules();
	//console.log('Created : DecisionMaker');
};

DecisionMaker.prototype.initRules = function() {
	//console.log('Initializing rules');
	this.ruleList = [];
	this.ruleList.push(new CheckVersion());
	this.ruleList.push(new Forecast());
	this.ruleList.push(new HelloRule());
	this.ruleList.push(new AwesomeTranslator());
};

DecisionMaker.prototype.mismatch = function(msg, response, dfd){
	response.setMsg("I don't really understand what you are saying....");
	//console.log(msg);
	dfd.resolve(response);
};

DecisionMaker.prototype.decide = function(msg, response, dfd, userData) {
	//console.log('Deciding.....');
	if(!this.ruleList || this.ruleList.length < 1) {
		this.initRules();
	}

	if(this.ruleList && this.ruleList.length > 0) {

		var matchScore = [];
		// Iterate and calculate match score
		//console.log('Calculating rules, found ' + this.ruleList.length + ' rules, iterating...');
		for(var i = 0; i < this.ruleList.length; i++) {
			//console.log(this.ruleList[i]);
			matchScore.push(this.ruleList[i].matchScore(msg, userData));
		}

		// Get Max Match score
		//console.log('Calculating max val');
		var maxVal = _.max(matchScore);

		// Do only over the threshold
		if (maxVal > THRESHOLD_SCORE) {
			// Find the correct rule from score
			//console.log('Query over the threshold, resolving...');
			var matchedIndex = _.findIndex(matchScore, function(el){return el==maxVal;});
			if(matchedIndex >= 0) {
				//console.log('Rule is resolving');
				this.ruleList[matchedIndex].solve(msg, response, dfd, userData);
			}
		} 
	}
};

module.exports = DecisionMaker;