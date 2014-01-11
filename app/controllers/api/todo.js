var _ = require('underscore');

module.exports = function(app) {

	app.get('/api/todo', function(req, res, next) {
		var p = req.query;

		if(!p) next();

		var search_string = p.search_string !== 'undefined' ? p.search_string : '';
		var sort_field = p.sort_field !== 'undefined' ? p.sort_field : 'priority';
		var is_desc = p.is_desc === 'true' ? true : false;
		var limit = p.limit !== 'undefined' ? parseInt(p.limit) : 20;
		var offset = p.offset !== 'undefined' ? parseInt(p.offset) : 0;

		sort_field = is_desc ? '-' + sort_field : sort_field;

		global.db.todo
		.find({ text: new RegExp(search_string) })
		.skip(offset)
		.limit(limit)
		.sort(sort_field)
		.exec(function(err, todos) {
			if(err) res.status(500).json(err);
			res.status(200).json(todos);
		});
	});

	app.get('/api/todo', function(req, res) {
		global.db.todo.find({}, function(err, todos) {
			if(err) res.status(500).json(err);
			res.status(200).json(todos);
		});
	});

	app.get('/api/:todoId/todo', function(req, res) {
		global.db.todo.findOne({ _id: req.params.todoId }, function(err, todo) {
			if(err) res.status(500).json(err);
			res.status(200).json(todo);
		});
	});

	app.post('/api/todo', function(req, res) {
		var todo = new global.db.todo(req.body);
		todo.save(function(err) {
			if(err) res.status(500).json(err);
			res.status(200).json(todo);
		});
	});

	app.put('/api/:todoId/todo', function(req, res) {
		global.db.todo.findOne({ _id: req.params.todoId }, function(err, todo) {
			if(err) res.status(500).json(err);
			todo = _.extend(todo, req.body);
			todo.save(function(err) {
				if(err) res.status(500).json(err);
				res.status(200).json(todo);
			});
		});
	});

	app.delete('/api/:todoId/todo', function(req, res) {
		global.db.todo.findOne({ _id: req.params.todoId }, function(err, todo) {
			if(err) res.status(500).json(err);
			todo.remove(function(err) {
				if(err) res.status(500).json(err);
				res.status(200).json({});
			});
		});
	});

}