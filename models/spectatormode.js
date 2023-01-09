const db = require("mongoose");

const SpectatormodeSchema = db.Schema({
	username: String,
	userId: {
		type: String,
		unique: true,
	},
	serverName: String,
	serverId: {
		type: String,
		unique: true,
	},
	channelSet: String,
	channelSetId: {
		type: String,
		unique: true,
	},
});

module.exports = db.model("Spectatormode", SpectatormodeSchema);
