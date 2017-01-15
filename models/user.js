var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
}, {
	timestamps: true
})
UserSchema.plugin(uniqueValidator);
UserSchema.methods.validPassword = function( pwd ) {
    return ( this.password === pwd );
};
module.exports = mongoose.model('user', UserSchema);