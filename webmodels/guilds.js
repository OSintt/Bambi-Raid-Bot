const mongoose = require("mongoose");

const GuildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	serverName: String,
	serverId: {
		type: String,
		unique: true,
	},
	serverMemberCount: Number,
	date: Date,
	by: String,
	byUsername: String,
	byDiscriminator: String,
	byMember: Boolean,
});

const db = mongoose.connection.useDb("Ethernal");

module.exports = db.model("Raid", GuildSchema);
