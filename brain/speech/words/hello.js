var Handlebars = require('handlebars');

var HelloWord = function Constructor() {
	this.wordList = [
		'Hello {{real_name}}, How are you?',
		'Fuck yeah! {{name}}, wassup???',
		'Huh??? {{name}}?',
		"Free? Why don't you work today, {{name}}?",
		"Sir! Yes sir!!! {{real_name}}"
		];
	this.compiledWordList = [];
	for(var i = 0; i < this.wordList.length; i++) {
		this.compiledWordList.push(Handlebars.compile(this.wordList[i]));
	}
};

HelloWord.prototype.getHelloList = function(){
	return this.wordList;
};

HelloWord.prototype.getHelloWord = function(data, num) {
	return this.compiledWordList[parseInt(num%this.compiledWordList.length)](data);
}


module.exports = HelloWord;