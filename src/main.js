//var Parse = require('parse/index');
var _ = require('underscore');

var config = require('./appConfig.json');

var Settings = require('./Settings');
var Database = require('./Database');
var cloudinary = require('./Cloudinary');

var Drawer = require('./Drawer');
var audiencePages = require('./Audience/BrowsePerformancesPage');

Database.initialize();

Drawer.initialize();
Settings.initialize();

var browsePages = audiencePages.initialize();

browsePages.featured.open();

