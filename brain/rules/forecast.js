var Similarity = require('string-score');
var _ = require('lodash');
var ForecastService = require('forecast');
var ForecastSpeech = require('../speech/sentences/Forecast/forecast');
var forecastSpeech = new ForecastSpeech();


var Forecast = function Constructor() {
	this.ctw = [13.746152, 100.539382];
	this.matchKeys = ['weather','forecast', 'climate', 'sunny', 'rainy'];
	this.forecast = new ForecastService({
		service: 'forecast.io',
		key: 'c153ad346c6eb13aba3efc950fc055a5',
		units: 'celcius', // Only the first letter is parsed 
		cache: true,      // Cache API requests? 
		ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/ 
			minutes: 10
		}
	});
};


Forecast.prototype.matchScore = function(msg, userData) {
	var scoreList = _.map(this.matchKeys, function(el){
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};

Forecast.prototype.solve = function(msg, response, dfd, userData) {
	this.forecast.get(this.ctw, function(err, weather) {
		if(err) {
			response.setMsg("We've got a problem to talk to forecast service...");
		} else {
			console.log(forecastSpeech);
			response.setMsg(forecastSpeech.getForecastSpeech(weather));
		}
		dfd.resolve(response);
	});
};

module.exports = Forecast;