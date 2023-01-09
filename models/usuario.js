const db = require("mongoose");

const UserSchema = db.Schema({
	username: String,
	userId: {
		type: String,
		unique: true,
	},
	date: String,
});

module.exports = db.model("Usuario", UserSchema);
