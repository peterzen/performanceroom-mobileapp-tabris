var _ = require('underscore');

var Database = require('../Database');
var PerformanceListWidget = require('../PerformanceListWidget');

function initialize() {

	var fetchPromise = Database.fetchFrontpageItems();

	var pages = {};

	pages.featured = PerformanceListWidget.createPerformanceListPage(
		fetchPromise,
		'Featured events',
		'images/page_all_books.png',
		function () {
			return true;
		});

	pages.comingUp = PerformanceListWidget.createPerformanceListPage(
		fetchPromise,
		'Coming up',
		'images/page_popular_books.png',
		function (performance) {
			return _.contains(['scheduled', 'upcoming'], performance.get('State'));
		});

	pages.live = PerformanceListWidget.createPerformanceListPage(
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
