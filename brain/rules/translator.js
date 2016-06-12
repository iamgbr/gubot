var Similarity = require('string-score');
var _ = require('lodash');

var thaidict = require("thaidict");

// Make it more beauty here,,,,, https://www.npmjs.com/package/thaidict

var AwesomeTranslator = function Constructor() {

	this.matchKeys = ['translate','translates'];
};


AwesomeTranslator.prototype.matchScore = function(msg, userData) {
	var scoreList = _.map(this.matchKeys, function(el){
		return Similarity(msg.text, el, 0.5);
	});
	return _.max(scoreList);
};

AwesomeTranslator.prototype.solve = function(msg, response, dfd, userData) {
	//console.log('AwesomeTranslator is working.... text : ' + msg.text);
	var parsedMsg = msg.text.split(' ');
	var msgIndex = _.findIndex(parsedMsg, function(el){ return _.lowerCase(el)=='translate' || _.lowerCase(el)=='translates'});
	msgIndex++; // expect that translate and then the word that we want to find
	if(parsedMsg[msgIndex] && _.camelCase(parsedMsg[msgIndex]).length > 1) {
		//console.log('msg pass a pre-condition');
		thaidict.init(function(){
			var textToSearch = _.camelCase(parsedMsg[msgIndex]);
			//console.log('ready to search ' + textToSearch);
			thaidict.search(textToSearch,function(result){
				//console.log('result comes back with ' + result.length + ' results');
				if(result && result.length > 0) {
					response.setMsg(textToSearch +'('+ result[0].type+ '.) means ' + result[0].result);
				} else {
					response.setMsg("I'm not quite sure what does " + textToSearch + ' mean');
				}

				dfd.resolve(response);
			});
		});
	} else {
		response.setMsg("I'm thinking that... maybe you don't understand how to use my smartness translator.\nOkay let's me explain, you have to type `gubot, my sweetness please translate {yourword} please`, and then I will translate for you, OKAYYYY?")
		dfd.resolve(response);
	}
};

module.exports = AwesomeTranslator;