const express = require("express");
const upload = require("../config/multer.js");
const {
	sendMessage,
	getMessages,
} = require("../controller/chat.controller.js");
const {
	sendPrivateMessage,
	getPrivateMessages,
} = require("../controller/chatPriv.controller.js");
const router = express.Router();

// Enviar un mensaje en una sala con o sin archivo
router.post("/room/:roomId/message", upload.single("file"), sendMessage);

// Obtener todos los mensajes de una sala
router.get("/room/:roomId/messages", getMessages);

// Enviar un mensaje en un chat privado
router.post(
	"/private/:userId1/:userId2/message",
	upload.single("file"),
	sendPrivateMessage,
);

// Obtener todos los mensajes de un chat privado
router.get("/private/:userId1/:userId2/messages", getPrivateMessages);

module.exports = router;
