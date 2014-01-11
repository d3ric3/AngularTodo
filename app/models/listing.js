// mongodb settings
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// schema defination
var ListingSchema = new Schema({
	text: { type: String, required: true },
	category: { type: String, required: true },
	price: { type: Number, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// virtual

// pre-save hook
ListingSchema.pre('save', function(next) {
	if(!this.isNew) {
		this.updated_at = new Date();
	}
	next();
});

// methods
ListingSchema.methods = {
}

// model name must same with file name
mongoose.model('listing', ListingSchema);