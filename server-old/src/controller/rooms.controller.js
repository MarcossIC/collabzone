const Rooms = require("../persistencia/models/rooms.models.js");
const Emp = require("../persistencia/models/emp.models.js");
const User = require("../persistencia/models/user.models.js");

// Crear Room
exports.createRoom = async (req, res) => {
	try {
		const { name, tileset } = req.body;
		const empresa = req.empresa; // La empresa ya está disponible desde el middleware

		// Validación: Verificar si la empresa está disponible y verificada
		// if (!empresa || !empresa.isVerified) {
		if (!empresa) {
			return res.status(403).json({
				message: "Acceso denegado. La empresa no está verificada.",
			});
		}

		// Validación: Verificar si se proporcionó el nombre de la room
		if (!name || name.trim() === "") {
			return res.status(400).json({
				message: "El nombre de la room es obligatorio.",
			});
		}

		// Crear la nueva room
		const newRoom = new Rooms({
			id_emp: empresa._id,
			name: name.trim(),
			tileset,
		});

		// Guardar la room en la base de datos
		const savedRoom = await newRoom.save();
		res.status(201).json({
			id: savedRoom.id,
			name: savedRoom.name,
			tileset: savedRoom.tileset,
			users: savedRoom.users,
			permissions: savedRoom.permissions,
		});
	} catch (error) {
		console.error("Error creando la room:", error);
		return res.status(500).json({
			message: "Error creando la room",
			error: error.message,
		});
	}
};

// ver Rooms
exports.getRooms = async (req, res) => {
	try {
		// Obtener todas las rooms de la base de datos
		const rooms = await Rooms.find();

		// Verificar si hay salas disponibles
		if (!rooms || rooms.length === 0) {
			return res.status(404).json({
				message: "No se encontraron salas.",
			});
		}

		// Enviar las salas encontradas
		return res.status(200).json(rooms);
	} catch (error) {
		console.error("Error obteniendo las salas:", error);
		return res.status(500).json({
			message: "Error interno del servidor al obtener las salas.",
			error: error.message,
		});
	}
};

// ver Room de empresa por Id
exports.getRoomsByEmpId = async (req, res) => {
	const empId = req.user ? req.user.id_emp : req.empresa.id;
	try {
		console.log(empId);
		console.log(req.empresa);

		if (!empId) {
			return res
				.status(400)
				.json({ message: "ID de empresa no proporcionado en el token" });
		}

		const rooms = await Rooms.find({ id_emp: empId });

		if (rooms.length === 0) {
			return res
				.status(404)
				.json({ message: "No se encontraron salas para esta empresa" });
		}

		res.status(200).json(
			rooms.map((rooms) => ({
				id: rooms.id,
				name: rooms.name,
				tileset: rooms.tileset,
				users: rooms.users,
				permissions: rooms.permissions,
			})),
		);
	} catch (error) {
		console.error("Error al obtener las salas:", error);
		res.status(500).json({ message: "Error al obtener las salas", error });
	}
};

// Obtener detalles de una sala por su ID
exports.getRoomById = async (req, res) => {
	try {
		const room = await Rooms.findById(req.params.id);
		if (!room) return res.status(404).json({ message: "Sala no encontrada" });
		res.status(200).json(room);
	} catch (error) {
		res.status(500).json({ message: "Error al obtener la sala", error });
	}
};

// Eliminar una sala por su ID
exports.deleteRoomById = async (req, res) => {
	try {
		const room = await Rooms.findByIdAndDelete(req.params.id);
		if (!room) return res.status(404).json({ message: "Sala no encontrada" });
		res.status(200).json({ message: "Sala eliminada con éxito" });
	} catch (error) {
		res.status(500).json({ message: "Error al eliminar la sala", error });
	}
};

exports.viewRooms = async (req, res) => {
	try {
		const { user } = req.user;
		const idemp = user.id_emp;
		const premit = user.permissions;
		const exrooms = await Rooms.find({
			id_emp: idemp,
			$or: [
				{ permissions: { $in: premit } },
				{ permissions: { $exists: true, $size: 0 } },
			],
		});

		if (!exrooms) {
			return res.status(404).json({ message: "No encontro ninguna sala" });
		}
		return res.status(200).json(exrooms, exrooms.users.legth);
	} catch (error) {
		res.status(500).json({ message: "Error al eliminar la sala", error });
	}
};
