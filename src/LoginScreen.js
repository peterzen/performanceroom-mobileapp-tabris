var _ = require('underscore');

var config = require('./appConfig.json');
var cloudinary = require('./Cloudinary');

//require('cordova-plugin-inappbrowser');

//var OAuth = require('./OAuth');

function initialize() {


	var page = tabris.create('Page', {
		title: 'Welcome to Performance Room!',
		layoutData: {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		},
		topLevel: true
	});

	var imageUrl = cloudinary.url(config.content.MainCoverImage, {
		//crop: 'fill',
		width: 1600,
		//height: 200
	});

	tabris.create('ImageView', {
		layoutData: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		},
		//image: {
		//	src: imageUrl
		//},
		scaleMode: 'fill'
	}).appendTo(page);

	var button = tabris.create('Button', {
		text: 'Sign in with Facebook',
		layoutData: {
			centerX: 0,
			top: 100
		}
	}).appendTo(page);

	var textView = tabris.create('TextView', {
		font: '24px',
		layoutData: {
			centerX: 0,
			top: [button, 50]
		}
	}).appendTo(page);

	button.on('select', function () {
		var noop = function() {
			textView.set('text', JSON.stringify(arguments));
			//console.log('DDDD');
		};

		try {
			OAuth.initialize('WgKtCq-YCLB1fK5tNxzHF1XPxxg');
			OAuth.popup('facebook')
				.done(function (result) {
					noop(result);
				})
				.fail(function (error) {
					console.log(error);
					noop(error);
				});

			//OAuth.authenticate(function (result) {
			//	console.log('OAUTH ***** ' + JSON.stringify(result));
			//});
		}
		catch(e){
			console.log('OAuth.authenticate '+JSON.stringify(e));
		}

		try {
			cordova.exec(noop, noop, "OAuth", "popup", 'facebook');
		}
		catch(e){
			console.log('OAuth.authenticate '+JSON.stringify(e));
		}


		//cordova.exec(noop, noop, "InAppBrowser", "open", ["http://google.com", "_system"]);
		//cordova.exec(noop, noop, "OAuth", "authenticate", ["http://google.com", "_system"]);

	});

	return page;
}

module.exports = {
	initialize: initialize
};
