var Handlebars = require('handlebars');

var ForecastSpeech = function Constructor() {
	this.wordList = [
		'Now?, the weather is *{{currently.summary}}*, Overall! {{hourly.summary}}',
		'*{{currently.temperature}}C* with {{hourly.summary}}'
		];
	this.compiledWordList = [];
	for(var i = 0; i < this.wordList.length; i++) {
		this.compiledWordList.push(Handlebars.compile(this.wordList[i]));
	}
};

ForecastSpeech.prototype.getForecastSpeech = function(data, num) {
	if (!num) {
		num = Math.random() * 1000;
	}
	return this.compiledWordList[parseInt(num%this.compiledWordList.length)](data);
}


module.exports = ForecastSpeech;


// Example of forecast data object
/*
{
  latitude: -33.8683,
  longitude: 151.2086,
  timezone: 'Australia/Sydney',
  offset: 10,
  currently: {
    time: 1367471626,
    summary: 'Partly Cloudy',
    icon: 'partly-cloudy-day', // For Skycons[https://github.com/darkskyapp/skycons] 
    precipIntensity: 0.088,
    precipProbability: 0.07,
    precipType: 'rain',
    temperature: 20.4,
    dewPoint: 12.24,
    windSpeed: 5.83,
    windBearing: 178,
    cloudCover: 0.32,
    humidity: 0.65,
    pressure: 1024.35,
    ozone: 275.6
  },
  hourly: {
    summary: 'Partly cloudy until tomorrow morning.',
    icon: 'partly-cloudy-day',
    data: [
      {
        time: 1367470800,
        summary: 'Partly Cloudy',
        icon: 'partly-cloudy-day',
        precipIntensity: 0.087,
        precipProbability: 0.07,
        precipType: 'rain',
        temperature: 20.42,
        dewPoint: 12.26,
        windSpeed: 5.89,
        windBearing: 179,
        cloudCover: 0.32,
        humidity: 0.65,
        pressure: 1024.31,
        ozone: 275.72
      },
      {
        // additional hours suppressed 
      }
    ]
  },
  daily: {
    summary: 'Sprinkling today; temperatures bottoming out at 19° on Sunday.',
    icon: 'rain',
    data: [
      {
        time: 1367416800,
        summary: 'Breezy in the morning.',
        icon: 'wind',
        sunriseTime: 1367440294,
        sunsetTime: 1367478912,
        precipIntensity: 0.061,
        precipIntensityMax: 0.009,
        precipIntensityMaxTime: 1367428500,
        precipType: 'rain',
        temperatureMin: 12.66,
        temperatureMinTime: 1367438400,
        temperatureMax: 20.42,
        temperatureMaxTime: 1367470800,
        dewPoint: 12.27,
        windSpeed: 5.79,
        windBearing: 194,
        cloudCover: 0.29,
        humidity: 0.72,
        pressure: 1023.87,
        ozone: 272.63
      },
      {
        // Additional days suppressed 
      }
    ]
  },
  flags: {
    sources: [ 'isd', 'fnmoc', 'naefs', 'cmc', 'gfs' ],
    'isd-stations': [
      '947670-99999',
      '947675-99999',
      '947680-99999',
      '957640-99999',
      '957660-99999'
    ],
    units: 'si'
  },
  expires: 1367473292205
}
*/