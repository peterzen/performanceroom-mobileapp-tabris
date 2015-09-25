var Parse = require('parse/index');
var _ = require('underscore');

var config = require('./appConfig.json');

var Settings = require('./Settings');
var cloudinary = require('./Cloudinary');


//console.log("DEBUG "+JSON.stringify(Parse));

var books = require("./books.json");
var performanceList = [];//require("./performances.json");

Parse.initialize('E6h4Kw98VnlzpKsvUbaRq1wPnSEJHnfzChbYNG3c', '2pKmpiYpRzqnbnlsHGIcXRR9YyrfMsKUxSjqFxrE');


var drawer = tabris.create("Drawer");

tabris.create("ImageView", {
	image: "images/cover.jpg",
	scaleMode: "fill",
	layoutData: {
		left: 0, right: 0, top: 0, height: 200
	}
}).appendTo(drawer);

tabris.create("PageSelector", {
	layoutData: {
		left: 0, top: 200, right: 0, bottom: 0
	}
}).appendTo(drawer);


var fetchPromise = fetchFrontpageItems();

var mainPage = createPerformanceListPage("Featured events", "images/page_all_books.png", function () {
	return true;
});

createPerformanceListPage("Coming up", "images/page_popular_books.png", function (performance) {
	return _.contains(['scheduled', 'upcoming'], performance.State);
});

createPerformanceListPage("Live", "images/page_favorite_books.png", function (performance) {
	return performance.State == 'live';
});

tabris.create("Action", {
	title: "Settings",
	image: {src: "images/action_settings.png", scale: 3}
}).on("select", function () {
	Settings.createSettingsPage().open();
});

mainPage.open();

function createPerformanceListPage(title, image, filter) {
	console.log('createPerformanceListPage ' );
	return tabris.create("Page", {
		title: title,
		topLevel: true,
		image: {
			src: image,
			scale: 3
		}
	}).append(createPerformanceList(fetchPromise, filter));
}

function createPerformancePage(performance) {
	var page = tabris.create("Page", {
		title: performance.get('Title')
	});
	var detailsComposite = createDetailsView(performance)
		.set("layoutData", {top: 0, height: 192, left: 0, right: 0})
		.appendTo(page);
	//createTabFolder().set({
	//	layoutData: {top: [detailsComposite, 0], left: 0, right: 0, bottom: 0}
	//}).appendTo(page);
	tabris.create("TextView", {
		layoutData: {height: 1, right: 0, left: 0, top: [detailsComposite, 0]},
		background: "rgba(0, 0, 0, 0.1)"
	}).appendTo(page);
	return page;
}

function createDetailsView(performance) {

	var composite = tabris.create("Composite", {
		background: "white",
		highlightOnTouch: true
	});

	tabris.create("Composite", {
		layoutData: {
			left: 0,
			right: 0,
			top: 0,
			height: 160 + 2 * config.PAGE_MARGIN
		}
	}).on("tap", function () {
		createReadBookPage(performance).open();
	}).appendTo(composite);

	var coverView = tabris.create("ImageView", {
		layoutData: {
			height: 160,
			width: 106,
			left: config.PAGE_MARGIN,
			top: config.PAGE_MARGIN
		},
		image: cloudinary.url(performance.get('PosterImages')[0])
	}).appendTo(composite);
	var titleTextView = tabris.create("TextView", {
		markupEnabled: true,
		text: "<h1>" + performance.get('Title') + "</h1>",
		layoutData: {
			left: [coverView, config.PAGE_MARGIN],
			top: config.PAGE_MARGIN,
			right: config.PAGE_MARGIN
		}
	}).appendTo(composite);

	var authorTextView = tabris.create("TextView", {
		layoutData: {
			left: [coverView, config.PAGE_MARGIN],
			top: [titleTextView, config.PAGE_MARGIN]
		},
		text: performance.get('HostingPerformer').get('StageName')
	}).appendTo(composite);

	tabris.create("TextView", {
		layoutData: {
			left: [coverView, config.PAGE_MARGIN],
			top: [authorTextView, config.PAGE_MARGIN]
		},
		textColor: "rgb(102, 153, 0)",
		text: performance.get('StartDate')
	}).appendTo(composite);
	return composite;
}

function createTabFolder() {
	var tabFolder = tabris.create("TabFolder", {tabBarLocation: "top", paging: true});
	var relatedTab = tabris.create("Tab", {title: "Related"}).appendTo(tabFolder);
	createPerformanceList(books).appendTo(relatedTab);
	var commentsTab = tabris.create("Tab", {title: "Comments"}).appendTo(tabFolder);
	tabris.create("TextView", {
		layoutData: {left: config.PAGE_MARGIN, top: config.PAGE_MARGIN, right: config.PAGE_MARGIN},
		text: "Great Book."
	}).appendTo(commentsTab);
	return tabFolder;
}

function createPerformanceList(performancePromise, filterFn) {

	//console.log('createPerformanceList ' + performances.length);

	var view = tabris.create("CollectionView", {
		layoutData: {left: 0, right: 0, top: 0, bottom: 0},
		itemHeight: 72,
		items: [],
		refreshEnabled: true,
		refreshIndicator: true,
		refreshMessage: "Loading...",
		initializeCell: function (cell) {
			var imageView = tabris.create("ImageView", {
				layoutData: {left: config.PAGE_MARGIN, centerY: 0, width: 32, height: 48},
				scaleMode: "fit"
			}).appendTo(cell);
			var titleTextView = tabris.create("TextView", {
				layoutData: {left: 64, right: config.PAGE_MARGIN, top: config.PAGE_MARGIN},
				markupEnabled: true,
				textColor: "#4a4a4a"
			}).appendTo(cell);
			var authorTextView = tabris.create("TextView", {
				layoutData: {left: 64, right: config.PAGE_MARGIN, top: [titleTextView, 4]},
				textColor: "#7b7b7b"
			}).appendTo(cell);
			cell.on("change:item", function (widget, performance) {
				//console.log("change:item   " + JSON.stringify(performance));
				//console.log("***\n\n\nchange:item   " + JSON.stringify(performance.get('Title')));
				var imageUrl = cloudinary.url(performance.get('PosterImages')[0], {
					crop: 'fill',
					width: 320,
					height: 200
				});

				//console.log("CLOUDINARY URL "+ imageUrl);
				imageView.set("image", imageUrl);
				titleTextView.set("text", performance.get('Title'));
				authorTextView.set("text", performance.get('HostingPerformer').get('StageName'));
			});
		}
	}).on("refresh", function() {
		view.set({
			refreshIndicator: true,
			refreshMessage: "Loading..."
		});

		fetchFrontpageItems()
			.then(function (result) {
				//console.log("PERFORMANCELIST" + JSON.stringify(result));
				view.set({
					items: result,
					refreshIndicator: false,
					refreshMessage: ""
				});
			});

	}).on("select", function (target, value) {
		createPerformancePage(value).open();
	});

	performancePromise.then(function(result){
		view.set({
			items: result.filter(filterFn),
			refreshIndicator: false,
			refreshMessage: ""
		});
	});
	return view;
}

function fetchFrontpageItems() {
	return Parse.Cloud.run('getFrontpageItems');
}


function createReadBookPage(performance) {
	var page = tabris.create("Page", {title: performance.title});
	var scrollView = tabris.create("ScrollView", {
		layoutData: {left: 0, right: 0, top: 0, bottom: 0},
		direction: "vertical"
	}).appendTo(page);
	var titleTextView = tabris.create("TextView", {
		layoutData: {left: config.PAGE_MARGIN, top: config.PAGE_MARGIN * 2, right: config.PAGE_MARGIN},
		textColor: "rgba(0, 0, 0, 0.5)",
		markupEnabled: true,
		text: "<h1>" + performance.Title + "</h1>"
	}).appendTo(scrollView);
	tabris.create("TextView", {
		layoutData: {
			left: config.PAGE_MARGIN,
			right: config.PAGE_MARGIN,
			top: [titleTextView, config.PAGE_MARGIN],
			bottom: config.PAGE_MARGIN
		},
		text: performance.Description
	}).appendTo(scrollView);
	return page;
}

