var dir = require('../lib/directory')
, DB_CONFIG =require('../../config/db')
, mongoose = require('mongoose');

// mongodb settings
module.exports = function(app) {

	// init db
	if(!global.hasOwnProperty('db')) {
		mongoose.connect(DB_CONFIG.mongodb.host);
		var conn = mongoose.connection;
		conn.on('error', console.error.bind(console, 'connection error: '));
		conn.on('open', function(){
			console.log('connected to mongodb!');
		});
	}

	global.db = {
		mongoose: mongoose
	}

	// bootstrap db collections
	dir.listFiles(__dirname).forEach(function(item) {
		if(item.filename == 'index.js') return;

		var re = /([\w]*)\./; // regular express for filename without extension
        var filename = re.exec(item.filename)[1]; // filename without extension

		require(item.path);
		global.db[filename] = mongoose.model(filename);
		
	});

	return global.db;
}