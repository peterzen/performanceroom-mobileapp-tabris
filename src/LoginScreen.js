var _ = require('underscore');

var config = require('./appConfig.json');
var cloudinary = require('./Cloudinary');


function initialize() {


	var page = tabris.create('Page', {
		title: 'Welcome to Performance Room!',
		layoutData: {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		},
		background: '#00ff00',
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
			bottom: 0,
			//centerX: 0,
			//centerY: 0,
			//width: '100%',
			//height: '100%'
		},
		background: '#ff0000',
		image: {
			src: imageUrl
		},
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
		textView.set('text', 'Totally Rock!');
	});

	return page;
}

module.exports = {
	initialize: initialize
};
