var _ = require('underscore');
var cloudinary = require('../Cloudinary');

var config = require('../appConfig.json');
var Database = require('../Database');
var PerformanceListWidget = require('../PerformanceListWidget');

function openPerformanceDetailsPage(target, value) {
	createPerformancePage(value).open();
}

function createPerformancePage(performance) {

	var imageUrl = cloudinary.url(performance.get('PosterImages')[0]);

	var page = tabris.create('Page', {
		title: performance.get('Title')
	});

	var scrollView = tabris.create('ScrollView', {
		layoutData: {left: 0, right: 0, top: 0, bottom: 0}
	}).on('tap', function () {
		createPlayVideoView(performance).open();
	}).appendTo(page);

	var imageTextView = tabris.create('ImageView', {
		layoutData: {left: 0, top: 0, right: 0}
	}).appendTo(scrollView);

	var titleComposite = tabris.create('Composite', {
		id: 'titleComposite',
		background: 'rgba(0,0,0,.4)',
		layoutData: {
			top: 0,
			//height: 60 + 3 * config.PAGE_MARGIN
		}
	}).appendTo(scrollView);

	var titleView = tabris.create('TextView', {
		layoutData: {left: config.PAGE_MARGIN, top: config.PAGE_MARGIN, right: config.PAGE_MARGIN},
		markupEnabled: true,
		text: '<b>' + performance.get('Title') + '</b>',
		font: '24px',
		textColor: 'white'
	}).appendTo(titleComposite);


	var contentComposite = tabris.create('Composite', {
		layoutData: {
			left: 0,
			right: 0,
			top: '#titleComposite',
			height: 1000
		},
		background: 'white'
	}).appendTo(scrollView);

	var subtitleView = tabris.create('TextView', {
		markupEnabled: true,
		text: 'by <b>' + performance.get('HostingPerformer').get('StageName') + '</b>',
		font: '16px',
		layoutData: {left: config.PAGE_MARGIN, right: config.PAGE_MARGIN, top: config.PAGE_MARGIN},
		textColor: '#666666'
	}).appendTo(contentComposite);

	tabris.create('TextView', {
		layoutData: {left: config.PAGE_MARGIN, right: config.PAGE_MARGIN, top: [subtitleView, config.PAGE_MARGIN]},
		text: performance.get('Description'),
		font: '16px'
	}).appendTo(contentComposite);



	scrollView.on('resize', function(widget, bounds) {

		var imageHeight = bounds.height / 1.778; // 1.4 is the image aspect ratio

		imageTextView.set('image', {
			src: imageUrl,
			width: bounds.width,
			height: bounds.height
		});
		var titleCompHeight = titleComposite.get('bounds').height;
		// we need the offset of the title composite in each scroll event
		// it can only change when a change:bounds is triggered, wo thats when we assign it
		titleCompY = Math.min(imageHeight - titleCompHeight, bounds.height / 2);
		titleComposite.set('layoutData', {left: 0, top: titleCompY, right: 0, height: 64});
	});

	scrollView.on('scroll', function(widget, offset) {
		imageTextView.set('transform', {translationY: offset.y * 0.4});
		if (titleCompY - offset.y < 0) {
			titleComposite.set('transform', {translationY: offset.y - titleCompY});
		} else {
			titleComposite.set('transform', {translationY: 0});
		}
	});

	return page;
}

function createDetailsView(performance) {

	var composite = tabris.create('Composite', {
		background: 'white',
		highlightOnTouch: true
	});

	tabris.create('Composite', {
		layoutData: {
			left: 0,
			right: 0,
			top: 0,
			height: 160 + 2 * config.PAGE_MARGIN
		}
	}).on('tap', function () {
		createPlayVideoView(performance).open();
	}).appendTo(composite);

	var imageUrl = cloudinary.url(performance.get('PosterImages')[0]);
	console.log('CLOUDINARY URL '+ imageUrl);

	var coverView = tabris.create('ImageView', {
		layoutData: {
			left: 0,
			top: 0,
			right: 0,
			scaleMode: 'fill',
			width: '100%'
		},
		image: imageUrl
	}).appendTo(composite);


	var titleTextView = tabris.create('TextView', {
		markupEnabled: true,
		text: '<h1>' + performance.get('Title') + '</h1>',
		layoutData: {
			left: config.PAGE_MARGIN,
			//top: config.PAGE_MARGIN,
			right: config.PAGE_MARGIN
		}
	}).appendTo(composite);

	var authorTextView = tabris.create('TextView', {
		layoutData: {
			left: [coverView, config.PAGE_MARGIN],
			top: [titleTextView, config.PAGE_MARGIN]
		},
		text: performance.get('HostingPerformer').get('StageName')
	}).appendTo(composite);

	tabris.create('TextView', {
		layoutData: {
			left: [coverView, config.PAGE_MARGIN],
			top: [authorTextView, config.PAGE_MARGIN]
		},
		textColor: 'rgb(102, 153, 0)',
		text: performance.get('StartDate')
	}).appendTo(composite);
	return composite;
}

function createTabFolder(performance) {

	var performer = performance.get('HostingPerformer');

	var tabFolder = tabris.create('TabFolder', {
		tabBarLocation: 'top',
		paging: true
	});

	var relatedTab = tabris.create('Tab', {
		title: 'More by ' + performer.get('StageName')
	}).appendTo(tabFolder);

	var promise = Database.getEventsByPerformer(performer);

	createPerformanceList(promise, function(){
		return true;
	}).appendTo(relatedTab);

	var commentsTab = tabris.create('Tab', {
		title: 'Comments'
	}).appendTo(tabFolder);

	tabris.create('TextView', {
		layoutData: {
			left: config.PAGE_MARGIN,
			top: config.PAGE_MARGIN,
			right: config.PAGE_MARGIN
		},
		text: 'Great Book.'
	}).appendTo(commentsTab);

	return tabFolder;
}



function createPlayVideoView(performance){

	var page = tabris.create('Page', {
		title: 'Video',
		topLevel: true
	});

	var view = tabris.create('Video', {
		layoutData: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		},
		url: 'http://peach.themazzone.com/durian/movies/sintel-1280-stereo.mp4'
	});

	view.appendTo(page);
	//tabris.ui.set('toolbarVisible', false);

	return page;
}




function createPerformanceListPage(fetchPromise, title, image, filter) {
	console.log('createPerformanceListPage ' );
	return tabris.create('Page', {
		title: title,
		topLevel: true,
		image: {
			src: image,
			scale: 3
		}
	}).append(PerformanceListWidget.createPerformanceList(fetchPromise, filter, openPerformanceDetailsPage));
}


function initialize() {

	var fetchPromise = Database.fetchFrontpageItems();

	var pages = {};

	pages.featured = createPerformanceListPage(
		fetchPromise,
		'Featured events',
		'images/page_all_books.png',
		function () {
			return true;
		});

	pages.comingUp = createPerformanceListPage(
		fetchPromise,
		'Coming up',
		'images/page_popular_books.png',
		function (performance) {
			return _.contains(['scheduled', 'upcoming'], performance.get('State'));
		});

	pages.live = createPerformanceListPage(
		fetchPromise,
		'Live',
		'images/page_favorite_books.png',
		function (performance) {
			return performance.get('State') == 'live';
		});

	return pages;
}

module.exports = {
	initialize: initialize
};
