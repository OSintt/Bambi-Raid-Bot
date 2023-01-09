const db = require("mongoose");

const CooldownsSchema = db.Schema({
	command: String,
	guilds: [
		{
			guildId: {
				type: String,
				unique: true,
			},
			date: Date,
		},
	],
});

module.exports = db.model("Cooldowns", CooldownsSchema);
