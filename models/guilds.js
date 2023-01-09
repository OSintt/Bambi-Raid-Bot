const db = require("mongoose");

const GuildSchema = db.Schema({
	serverName: String,
	serverId: {
		type: String,
		unique: true,
	},
});

module.exports = db.model("Guild", GuildSchema);
