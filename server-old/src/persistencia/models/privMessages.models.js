const mongoose = require("mongoose");

const privateChatSchema = new mongoose.Schema({
	participants: [String], // IDs de los usuarios
	messages: [
		{
			senderId: String,
			message: String,
			createdAt: { type: Date, default: Date.now },
		},
	],
});

module.exports = mongoose.model("PrivateChat", privateChatSchema);
