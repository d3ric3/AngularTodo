var _ = require('underscore');

module.exports = function(app) {

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