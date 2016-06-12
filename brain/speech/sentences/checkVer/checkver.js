var Handlebars = require('handlebars');

var CheckVer = function Constructor() {
	this.wordList = [
		'Yo! I found that currently the website verion is "*{{changesetId}}*" which is created from "`{{branchName}}`" branch at "*{{when}}*"',
		'Easy! This package comes from `{{branchName}}`(*{{changesetId}}*) at *{{when}}*',
		'I guess, it is `{{branchName}}`, so..... the version is *{{changesetId}}* at *{{when}}*, is it correct?'
		];
	this.compiledWordList = [];
	for(var i = 0; i < this.wordList.length; i++) {
		this.compiledWordList.push(Handlebars.compile(this.wordList[i]));
	}
};

CheckVer.prototype.getCheckVer = function(data, num) {
	if (!num) {
		num = Math.random() * 1000;
	}
	return this.compiledWordList[parseInt(num%this.compiledWordList.length)](data);
}


module.exports = CheckVer;