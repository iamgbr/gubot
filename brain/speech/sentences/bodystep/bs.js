var Handlebars = require('handlebars');

var BS = function Constructor() {
	this.timetableTemplate = "Yo! Check it out\n*Today*\n{{#each morning}}{{#if this.isToday}}{{#each this.classes}} `{{this.timeText}} by {{this.instructor}} at {{this.clubName}}`\n{{/each}}{{/if}}{{/each}}{{#each afternoon}}{{#if this.isToday}}{{#each this.classes}} `{{this.timeText}} by {{this.instructor}} at {{this.clubName}}`\n{{/each}}{{/if}}{{/each}}{{#each evening}}{{#if this.isToday}}{{#each this.classes}} `{{this.timeText}} by {{this.instructor}} at {{this.clubName}}`\n{{/each}}{{/if}}{{/each}}";
	this.compiledTT = Handlebars.compile(this.timetableTemplate);

	this.timetableTemplateByDate = "Yo! Check it out\n*{{day}} {{formattedDate}}*\n{{#each classes}} `{{this.timeText}} by {{this.instructor}} at {{this.clubName}}`\n{{/each}}";
	this.compiledTTByDate = Handlebars.compile(this.timetableTemplateByDate);
};

BS.prototype.getBS = function(data, num) {
	return this.compiledTT(data);
}

BS.prototype.getBSByDate = function(data) {
	return this.compiledTTByDate(data);
}

module.exports = BS;