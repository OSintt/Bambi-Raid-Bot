const db = require("mongoose");

const BotownerSchema = db.Schema({
	username: String,
	userId: {
		type: String,
		unique: true,
	},
});

module.exports = db.model("Botowner", BotownerSchema);
