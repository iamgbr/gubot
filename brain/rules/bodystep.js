var http = require('http');
var request = require('request');
var str = require('string-format');
var Similarity = require('string-score');
var _ = require('lodash');
var ajaxRequest = require('ajax-request');
var bodystepText = require('../speech/sentences/bodystep/bs');
var moment = require('moment');


var platinumClubs = "th-platinumsathornsquare,th-aiacapitalcenter,th-platinumlandmarkplaza,th-platinumqhouselumpini,th-platinumshukumvit39,th-platinumsiamparagon";
var closedToMeClubs = "th-centralplazapinklao,th-centralplazagrandrama9,th-platinumsathornsquare,th-platinumqhouselumpini,th-platinumlandmarkplaza,th-platinumsiamparagon,th-platinumshukumvit39,th-terminal21,th-themallbangkhae,th-themallthapra,th-aiacapitalcenter";
var allClubs = null;

var BodyStep = function Constructor() {
	this.url = 'https://www.fitnessfirst.co.th/en-GB/classes/ff-timetables/ClassTimes/';
	this.matchKeys = ['bodystep','timetable','dance','gym','bodystep class','show bodystep class'];
	this.reqMsg = {
		"classes":"th-bodystep",
		"clubs": closedToMeClubs,
		"studios": null,
		"trainers": null,
		"times": null,
		"levels": null,
		"genders" : null
	};
	

};

BodyStep.prototype.matchScore = function(msg, userData) {
	//console.log('Mapping to score-based');
	var scoreList = _.map(this.matchKeys, function(el){
		//console.log('Calculating Similarity score for "' + el + '"');
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};


BodyStep.prototype.solve = function(msg, response, dfd, userData) {
	ajaxRequest.post({
	  url: this.url,
	  data: this.reqMsg,
	  headers: {}
	},function(err, res, body){
		if(err){
			BodyStep.prototype.replySiteError(response,dfd);
			return;
		}

		if(!body){
			BodyStep.prototype.replyNullData(response,dfd);
			return;
		}
		var jsonObj = JSON.parse(body);
		BodyStep.prototype.renderTimetable(msg, response, dfd, userData, jsonObj);
	});

};

BodyStep.prototype.replySiteError = function(response, dfd) {
	response.setMsg("Fitness First service is unavailable . . . . :( . . .");
	dfd.resolve(response);
}

BodyStep.prototype.replyNullData = function(response, dfd) {
	response.setMsg("Fitness First service returns stupid data . . . . :( . . .");
	dfd.resolve(response);
}

var mergeClass = function(obj1, obj2){
	if (obj1 && obj2 && _.isArray(obj1.classes) && _.isArray(obj2.classes)) {
		obj1.classes = _.concat(obj1.classes, obj2.classes);
		return obj1;
	} else {
		console.log("Merge class fails!!!");
	}
};

var getClassByDate = function(data, date){
	var morning = findClassInArr(data.morning, date);
	var afternoon = findClassInArr(data.afternoon, date);
	var evening = findClassInArr(data.evening, date);
	var final = mergeClass(mergeClass(morning, afternoon), evening);
	return final;
};

var findClassInArr = function(days, date){
	var want;
	if(_.toLower(date) == 'tomorrow' ||
		_.toLower(date) == 'tmr') {
		date = moment().add(1, 'days').format("YYYYMMDD").toString();
	}
	//console.log('I want ' + date);
	_(days).forEach(function(obj){
		//console.log(obj.day + ' ' +obj.dayShort + ' ' +obj.formattedDate + ' ' +obj.date + ' ');
		if(_.toLower(obj.day) == _.toLower(date) ||
			_.toLower(obj.dayShort) == _.toLower(date) ||
			_.toLower(obj.formattedDate) == _.toLower(date) ||
			_.toLower(obj.date) == _.toLower(date)
			) {
			//console.log('Matched!!!!');
			want = obj;
		}
	});
	return want;
};


BodyStep.prototype.renderTimetable = function(msg, response, dfd, userData, data) {
	//console.log();
	var bsText = new bodystepText();
	/*
	var res = bsText.getBS(data);
	response.setMsg(res);
	*/
	var splitedMsg = msg.text.split(' ');
	var res = getClassByDate(data, splitedMsg[splitedMsg.length-1]);
	if(res) {
		response.setMsg(bsText.getBSByDate(res));
	} else {
		response.setMsg(bsText.getBS(data));
	}

	dfd.resolve(response);
}

module.exports = BodyStep;