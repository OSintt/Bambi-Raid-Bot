const db = require("mongoose");

const HackermemberSchema = db.Schema({
	username: String,
	userId: {
		type: String,
		unique: true,
	},
});

module.exports = db.model("Hackermember", HackermemberSchema);
