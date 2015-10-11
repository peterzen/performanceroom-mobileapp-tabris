

var config = require('./appConfig.json');

function createSettingsPage() {
	var page = tabris.create("Page", {
		title: "License"
	});
	var settingsTextView = tabris.create("TextView", {
		text: "Book covers come under CC BY 2.0",
		layoutData: {
			left: config.PAGE_MARGIN,
			right: config.PAGE_MARGIN,
			top: config.PAGE_MARGIN
		}
	}).appendTo(page);

	var url = "https://www.flickr.com/photos/ajourneyroundmyskull/sets/72157626894978086/";

	var linkTextView = tabris.create("TextView", {
		text: "<a href=\"" + url + "\">Covers on flickr</a>",
		markupEnabled: true,
		layoutData: {left: config.PAGE_MARGIN, right: config.PAGE_MARGIN, top: [settingsTextView, 10]}
	}).appendTo(page);

	tabris.create("TextView", {
		text: "<i>Authors of book covers:</i><br/>" +
		"Paula Rodriguez - 1984<br/>" +
		"Marc Storrs and Rob Morphy - Na Tropie Nieznanych<br/>" +
		"Cat Finnie - Stary Czlowiek I Morze<br/>" +
		"Andrew Brozyna - Hobbit<br/>" +
		"Viacheslav Vystupov - Wojna Swiatow<br/>" +
		"Marc Storrs and Rob Morphy - Zegar Pomaranczowy Pracz<br/>" +
		"Andrew Evan Harner - Ksiega Dzungli",
		markupEnabled: true,
		layoutData: {left: config.PAGE_MARGIN, right: config.PAGE_MARGIN, top: [linkTextView, 10]}
	}).appendTo(page);

	tabris.create('Action', {
		title: 'Settings',
		image: {src: 'images/action_settings.png', scale: 3}
	}).on('select', function () {
		Settings.createSettingsPage().open();
	});

	return page;
}

function initialize(){

	tabris.create('Action', {
		title: 'Settings',
		image: {
			src: 'images/action_settings.png',
			scale: 3
		}
	}).on('select', function () {
		createSettingsPage().open();
	});
}



module.exports = {
	initialize: initialize
};
