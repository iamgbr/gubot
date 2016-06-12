var Msg = function Constructor(params) {

};

Msg.prototype.compose = function(msg) {
	return {
		channel : msg.channel, 
		response : '', 
		setMsg : Msg.setMsg
	};
};

Msg.setMsg = function(txt) {
	this.response = txt;
	return this;
};

Msg.setMarkdown = function() {

};

module.exports = Msg;