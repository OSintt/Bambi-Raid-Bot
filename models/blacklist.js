const db = require("mongoose");

const BlacklistSchema = db.Schema({
	username: String,
	userId: {
		type: String,
		unique: true,
	},
	reason: String,
	reportedBy: String,
	reportedById: String,
	date: Date,
});

module.exports = db.model("Blacklist", BlacklistSchema);
