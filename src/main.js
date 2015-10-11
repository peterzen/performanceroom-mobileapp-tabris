
var _ = require('underscore');

var config = require('./appConfig.json');
var Database = require('./Database');

var Settings = require('./Settings');
var Drawer = require('./Drawer');
var AudiencePages = require('./Audience/BrowsePerformancesPage');
var LoginScreen = require('./LoginScreen');

Database.initialize();

Drawer.initialize();
Settings.initialize();


var browsePages = AudiencePages.initialize();
//browsePages.featured.open();

LoginScreen.initialize().open();

