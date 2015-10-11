

function initialize() {

	var drawer = tabris.create('Drawer');

	tabris.create('ImageView', {
		image: 'images/cover.jpg',
		scaleMode: 'fill',
		layoutData: {
			left: 0, right: 0, top: 0, height: 200
		}
	}).appendTo(drawer);

	tabris.create('PageSelector', {
		layoutData: {
			left: 0, top: 200, right: 0, bottom: 0
		}
	}).appendTo(drawer);

	return drawer;
}


module.exports = {
	initialize: initialize
};
