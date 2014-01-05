var dir = require('../lib/directory')

module.exports = function(app) {
	var app = app;
	
	dir.listFiles(__dirname).forEach(function(item) {
		if(item.filename == 'index.js') return;
		// require all .js file in controllers folder
		require(item.path)(app); 
	});
	
}
