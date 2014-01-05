// mongodb settings
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// schema defination
var TodoSchema = new Schema({
	text: { type: String, required: true },
	due_date: { type: Date },
	priority: { type: Number, min: 0, max: 10, default: 0 },
	done: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// virtual

// pre-save hook
TodoSchema.pre('save', function(next) {
	if(!this.isNew) {
		this.updated_at = new Date();
	}
	next();
});

// methods
TodoSchema.methods = {
}

// model name must same with file name
mongoose.model('todo', TodoSchema);