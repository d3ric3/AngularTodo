var LocalStrategy = require('passport-local');

module.exports = function(passport) {

	// local strategy section
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		global.db.user.findOne({ _id: id }, '-salt -hashed_password', function(err, user) {
			console.log(user);
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done) {
		global.db.user.findOne({ email: email }, function(err, user) {
			if(err) done(err);
			if(!user) return done(null, false, { message: 'User does not exists in the system' });
			if(!user.authenticate(password)) return done(null, false, { message: 'Invalid password' });
			return done(null, user);
		})	
	}))

}