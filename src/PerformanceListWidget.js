
var _ = require('underscore');

var config = require('./appConfig.json');
var cloudinary = require('./Cloudinary');


function createPerformanceList(performancePromise, filterFn, onSelectFn) {

	//console.log('createPerformanceList ' + performances.length);

	var view = tabris.create('CollectionView', {
		layoutData: {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		},
		itemHeight: 120,
		items: [],
		refreshEnabled: true,
		refreshIndicator: true,
		refreshMessage: 'Loading...',
		initializeCell: function (cell) {
			var imageView = tabris.create('ImageView', {
				layoutData: {
					left: config.PAGE_MARGIN,
					centerY: 0,
					width: 160,
					height: 100
				},
				scaleMode: 'fill'
			}).appendTo(cell);

			var titleTextView = tabris.create('TextView', {
				layoutData: {
					left: 160 + 2 * config.PAGE_MARGIN,
					right: config.PAGE_MARGIN,
					top: config.PAGE_MARGIN
				},
				markupEnabled: true,
				textColor: '#4a4a4a'
			}).appendTo(cell);

			var authorTextView = tabris.create('TextView', {
				layoutData: {
					left: 160 + 2 * config.PAGE_MARGIN,
					right: config.PAGE_MARGIN,
					top: [titleTextView, 4]
				},
				textColor: '#7b7b7b'
			}).appendTo(cell);

			cell.on('change:item', function (widget, performance) {
				//console.log('change:item   ' + JSON.stringify(performance));
				//console.log('***\n\n\nchange:item   ' + JSON.stringify(performance.get('Title')));
				var imageUrl = cloudinary.url(performance.get('PosterImages')[0], {
					crop: 'fill',
					width: 320,
					height: 200
				});

				//console.log('CLOUDINARY URL '+ imageUrl);
				imageView.set('image', imageUrl);
				titleTextView.set('text', performance.get('Title'));
				authorTextView.set('text', performance.get('HostingPerformer').get('StageName'));
			});
		}
	}).on('refresh', function() {
		view.set({
			refreshIndicator: true,
			refreshMessage: 'Loading...'
		});

		Database.getEventsByCurrentPerformer()
			.then(function (result) {
				//console.log('PERFORMANCELIST' + JSON.stringify(result));
				view.set({
					items: result,
					refreshIndicator: false,
					refreshMessage: ''
				});
			});

	}).on('select', onSelectFn);

	performancePromise.then(function(result){
		//console.log('\n\n\n*** FETCH ' + JSON.stringify(result));
		view.set({
			items: result.filter(filterFn),
			refreshIndicator: false,
			refreshMessage: ''
		});
	});
	return view;
}


module.exports = {
	createPerformanceList: createPerformanceList
};
