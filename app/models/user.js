// mongodb settings
var mongoose = require('mongoose')
, Schema = mongoose.Schema
, crypto = require('crypto');

// schema defination
var UserSchema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	hashed_password: { type: String, required: true },
	salt: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// virtual
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.encryptPassword(password);
}).get(function(){
	return this._password;
});

// pre-save hook
UserSchema.pre('save', function(next) {
	if(!this.isNew) {
		this.updated_at = new Date();
	}
	next();
});

// methods
UserSchema.methods = {

	authenticate: function(plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	encryptPassword: function(plainText) {
		if(!plainText || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(plainText, salt, 10000, 64).toString('base64');
	}
}

// model name must same with file name
mongoose.model('user', UserSchema);
