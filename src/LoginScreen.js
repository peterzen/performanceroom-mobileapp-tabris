var _ = require('lodash');

var config = require('./appConfig.json');
var cloudinary = require('./Cloudinary');

var Auth0Lock = require('auth0-lock/standalone');

function initialize() {

	var lock = new Auth0Lock(
		'Ie1dlpqy8TnIhAQyajPzVLyyq10IQZZL',
		'performanceroom.eu.auth0.com'
	);



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
		var callback = function() {
			textView.set('text', JSON.stringify(arguments));
			//console.log('DDDD');
		};

		console.log('OAUTH ***** ', cordova);

		lock.show(function(err, profile, token) {
			if (err) {
				// Error callback
				console.log("There was an error");
				alert("There was an error logging in");
			} else {

				// Success calback

				alert(JSON.stringify(profile));
				//
				//// Save the JWT token.
				//localStorage.setItem('userToken', token);

			}
		});


		//cordova.InAppBrowser.open('http://google.com');

	});

	return page;
}

module.exports = {
	initialize: initialize
};




