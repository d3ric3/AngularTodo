module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('root/index', { title: 'Express' });
	});

}