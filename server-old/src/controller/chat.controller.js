const Message = require("../persistencia/models/messages.models.js");
const parseEmotes = require("../utils/emoteParser.js");
const cloudinary = require("../config/cloudinaryConfig.js");

// Enviar un mensaje en una sala
exports.sendMessage = async (req, res) => {
	try {
		let { message, senderId } = req.body;
		const fileUrl = null;

		if (req.file) {
			const result = await cloudinary.uploader
				.upload_stream({ resource_type: "auto" }, (error, result) => {
					if (error) {
						throw new Error("Error al subir el archivo a Cloudinary");
					}
					return result;
				})
				.end(req.file.buffer); // Enviamos el buffer del archivo para su subida

			fileUrl = result.secure_url; // Obtenemos la URL segura del archivo subido
		}

		// Parsear los emotes
		message = parseEmotes(message);

		const newMessage = new Message({
			roomId: req.params.roomId,
			senderId,
			message,
			fileUrl,
		});

		await newMessage.save();
		res.status(201).json(newMessage);
	} catch (error) {
		res.status(500).json({ error: "Error al enviar el mensaje" });
	}
};

// Obtener todos los mensajes de una sala
exports.getMessages = async (req, res) => {
	try {
		const messages = await Message.find({ roomId: req.params.roomId });
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ error: "Error al obtener los mensajes" });
	}
};
