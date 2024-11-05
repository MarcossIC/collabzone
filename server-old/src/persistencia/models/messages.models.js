const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	roomId: String,
	senderId: String,
	message: String,
	fileUrl: String, // Si el mensaje contiene un archivo
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
