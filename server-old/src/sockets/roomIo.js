const Rooms = require("../persistencia/models/rooms.models");
const User = require("../persistencia/models/user.models");
const Notifications = require("../persistencia/models/notifications.models");
const socketAuth = require("../middlewares/socketAuth.js");
const Messages = require("../persistencia/models/messages.models.js");
const PrivateChat = require("../persistencia/models/privMessages.models.js");

const handleSocketEvents = (io) => {
	io.use(socketAuth);

	const userChangeStream = User.watch();
	userChangeStream.on("change", (change) => {
		if (change.operationType === "update") {
			const userId = change.documentKey._id;
			const updatedFields = change.updateDescription.updatedFields;
			if (updatedFields.status) {
				io.emit("userStatusUpdate", { userId, status: updatedFields.status });
			}
		}
	});

	const notificationChangeStream = Notifications.watch();
	notificationChangeStream.on("change", (change) => {
		if (change.operationType === "insert") {
			const newNotification = change.fullDocument;
			io.to(newNotification.userId).emit("newNotification", newNotification);
		}
	});

	const messageChangeStream = Messages.watch();
	messageChangeStream.on("change", (change) => {
		if (change.operationType === "insert") {
			const newMessage = change.fullDocument;
			io.to(newMessage.roomId).emit("newMessage", newMessage);
		}
	});

	const privateChatChangeStream = PrivateChat.watch();
	privateChatChangeStream.on("change", (change) => {
		if (change.operationType === "update" && change.updateDescription.updatedFields.messages) {
			const chatId = change.documentKey._id;
			const newMessage = change.updateDescription.updatedFields.messages.slice(-1)[0];
			const participants = change.fullDocument.participants;
			participants.forEach(participant => io.to(participant).emit("newPrivateMessage", { chatId, newMessage }));
		}
	});

	io.on("connection", (socket) => {
		const user = socket.user;
		User.findByIdAndUpdate(user._id, { status: "online", socketId: socket.id }, { new: true })
			.then(() => {
				console.log(`${user.username} se ha conectado.`);
				io.emit("userStatusUpdate", { userId: user._id, status: "online" });
			})
			.catch(console.error);

		socket.on("joinRoom", async ({ roomId, x, y }) => {
			try {
				const room = await Rooms.findById(roomId);
				if (!room) return;

				socket.roomId = roomId;
				socket.rooms.forEach((room) => {
					if (room !== socket.id) {
						socket.leave(room);
						io.to(room).emit("userLeft", { user: user._id });
					}
				});

				const isUserInRoom = room.users.some(u => u.userId.toString() === user._id.toString());
				if (!isUserInRoom) {
					const newUser = {
						userId: user._id,
						socketId: socket.id,
						username: user.username || null,
						x,
						y
					};
					room.users.push(newUser);
					await room.save();
					socket.join(roomId);

					socket.emit("userList", room.users);
					socket.to(roomId).emit("newUserJoined", newUser);
					console.log("newUser", newUser);

					io.to(room._id).emit("userCountUpdate", room.users.length);
					console.log(`${user.username} se ha unido a la sala ${roomId}.`);
				}
			} catch (error) {
				console.error("Error al unirse a la sala:", error);
			}
		});

		socket.on("updatePosition", async ({ x, y, prevDirection, direction }) => {
			const roomId = Array.from(socket.rooms).find(room => room !== socket.id);
			console.log("roomId", roomId);

			if (roomId) {
				await Rooms.findOneAndUpdate(
					{ _id: roomId, "users.userId": user._id },  // Busca la sala y el usuario dentro de esa sala
					{
						$set: {
							"users.$.x": x,
							"users.$.y": y,
						}
					}, { new: true }
				);
				console.log("condenada", x, y);

				socket.broadcast.to(roomId).emit("userMoved", { userId: user._id, x, y, prevDirection, direction });
			}
		});

		socket.on("disconnect", async () => {
			console.log(`${user.username} se ha desconectado.`);

			// Usa socket.roomId directamente
			const roomId = socket.roomId;

			if (!roomId) {
				console.error("No se encontró un roomId válido.");
				return;
			}

			try {
				await User.findByIdAndUpdate(user._id, { status: "offline", socketId: "" });

				const room = await Rooms.findOneAndUpdate(
					{ _id: roomId },
					{ $pull: { users: { userId: user._id } } },
					{ new: true }
				);

				if (room) {
					socket.to(roomId).emit("userLeft", { user: user._id });
					socket.to(roomId).emit("userCountUpdate", room.users.length);
					console.log(`El usuario ${user.username} ha dejado la sala ${room._id}.`);
				}
			} catch (error) {
				console.error("Error al manejar desconexión:", error);
			}
		});
	});
};

module.exports = { handleSocketEvents };