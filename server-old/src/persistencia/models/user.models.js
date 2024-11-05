const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: function () {
				return !this.authId; // Solo requerido si no es un usuario de Auth0
			},
		},
		authId: {
			type: String,
			required: false, // Se llenará solo si es un usuario de Auth0
		},
		sub: {
			type: String,
			unique: true,
			sparse: true, // Permitir valores nulos en un campo único
		},
		firstName: {
			type: String,
			required: false,
		},
		lastName: {
			type: String,
			required: false,
		},
		socketId: {
			type: String,
			default: "",
			required: false,
		},
		profilePicture: {
			type: String,
			default:
				"https://res.cloudinary.com/ddvbwaedm/image/upload/v1729026786/hxerl0iycrhtxbk8vak9.jpg", // Imagen por defecto
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		id_emp: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Emp'
		},
		rol: {
			type: String,
			required: false,
		},
		status: {
			type: String,
			enum: ["online","busy","disconnected"],
		},
		permissions: {
			type: Array,
			default: []
		},
		notifications: [
			{ type: mongoose.Schema.Types.ObjectId, 
			ref: 'Notification'
			} 
		]
	},
	{ timestamps: true },
);
const User = mongoose.model("User", userSchema);
module.exports = User;
