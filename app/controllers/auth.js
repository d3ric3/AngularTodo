var jwt = require('jsonwebtoken');

module.exports = function(app) {

	app.post('/login', function(req, res) {
		if (!(req.body.email === 'd3ric3@gmail.com' && req.body.password === 'badguy88')) {
			res.status(401).send('Wrong user or password');
			return;
		  }

		  // hard-coded user
		  var profile = {
			first_name: 'Derice',
			last_name: 'Kong',
			email: 'd3ric3@gmail.com',
			id: 1
		  };

		  // We are sending the profile inside the token
		  var token = jwt.sign(profile, global.jwt_secret, { expiresInMinutes: 60*5 });

		  res.json({ token: token });
	});

}