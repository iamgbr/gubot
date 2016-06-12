var http = require('http');
var request = require('request');
var str = require('string-format');
var checkVersionLib = require('../speech/sentences/checkVer/checkver');
var checkVersionText = new checkVersionLib();
var Similarity = require('string-score');
var _ = require('lodash');


var CheckVersion = function Constructor() {
	this.url = 'http://www.agoda.com/version_json.htm';
	this.matchKeys = ['show version', 'website version', 'show website version', 'version website', 'version web'];
};

CheckVersion.prototype.matchScore = function(msg, userData) {
	//console.log('Mapping to score-based');
	var scoreList = _.map(this.matchKeys, function(el){
		//console.log('Calculating Similarity score for "' + el + '"');
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};


CheckVersion.prototype.solve = function(msg, response, dfd, userData) {
	request(this.url, function (error, msg, body) {
	  if (!error && msg.statusCode == 200) {
	  	var jsonObj = JSON.parse(body);
	  	var translated = checkVersionText.getCheckVer(jsonObj.build);
	  	//console.log("Reply : "+translated);
	  	response.setMsg(translated);
	  	dfd.resolve(response);
	  }
	  else {
	    //console.log("Error "+msg.statusCode)
	  }
	});
};

module.exports = CheckVersion;