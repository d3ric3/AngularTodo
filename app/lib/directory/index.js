var fs = require('fs');

module.exports = {

	listFiles: function(initialPath) {

		var items = [];

		var scanFiles = function(path) {

			fs.readdirSync(path).forEach(function(filename) {

				var currentPath = path + '/' + filename;
				var stat = fs.statSync(currentPath);

				if (stat.isFile())
					items.push({ path: currentPath, filename: filename });
				else if (stat.isDirectory())
					scanFiles(currentPath);

			});	

		}

		scanFiles(initialPath);

		return items;
		
	}

}
