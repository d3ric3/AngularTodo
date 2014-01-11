var _ = require('underscore');

module.exports = function(app) {

	app.get('/api/listing', function(req, res, next) {
		var q = req.query;

		if(!q) next();

		var sort_field = q.sort_field !== 'undefined' ? q.sort_field : 'priority';
		var is_desc = q.is_desc === 'true' ? true : false;

		sort_field = is_desc ? '-' + sort_field : sort_field;

		global.db.listing.
		find({}).
		sort(sort_field).
		exec(function(err, listings) {
			if(err) res.status(500).json(err);
			res.status(200).json(listings);
		});

	});

	app.get('/api/listing', function(req, res) {
		global.db.listing.find({}, function(err, listings) {
			if(err) res.status(500).json(err);
			res.status(200).json(listings);
		});
	});

	app.get('/api/:listingId/listing', function(req, res) {
		global.db.listing.findOne({ _id: req.params.listingId }, function(err, listing) {
			if(err) res.status(500).json(err);
			res.status(200).json(listing);
		});
	});

	app.post('/api/listing', function(req, res) {
		var listing = new global.db.listing(req.body);
		listing.save(function(err) {
			if(err) res.status(500).json(err);
			res.status(200).json(listing);
		});
	});

	app.put('/api/:listingId/listing', function(req, res) {
		global.db.listing.findOne({ _id: req.params.listingId }, function(err, listing) {
			if(err) res.status(500).json(err);
			listing = _.extend(listing, req.body);
			listing.save(function(err) {
				if(err) res.status(500).json(err);
				res.status(200).json(listing);
			});
		});
	});

	app.delete('/api/:listingId/listing', function(req, res) {
		global.db.listing.findOne({ _id: req.params.listingId }, function(err, listing) {
			if(err) res.status(500).json(err);
			listing.remove(function(err) {
				if(err) res.status(500).json(err);
				res.status(200).json({});
			});
		});
	});

}