var mongoose = require("mongoose");
const WidgetSchema = new mongoose.Schema({
	title: String,
	city: Number,
	days: Number,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {
	timestamps: true
})
module.exports = mongoose.model('widget', WidgetSchema);