
var Parse = require('parse/index');

var config = require('./appConfig.json').parse;


module.exports = {
	initialize: function(){
		Parse.initialize(config.appId, config.javascriptKey);
	},

	fetchFrontpageItems: function(){
		console.log("getFrondfdfgdfgdfgtpageItems");
		return Parse.Cloud.run('getFrontpageItems');
	},

	getEventsByPerformer: function(performer){
		return Parse.Cloud.run('getEventsByPerformer', {
			performerId: performer.id
		});
	}
};
