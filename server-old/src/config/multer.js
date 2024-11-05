const multer = require("multer");

const storage = multer.memoryStorage(); // Cambiamos a almacenamiento en memoria

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // Limita el tamaño del archivo a 10MB
	},
	fileFilter: (req, file, cb) => {
		const filetypes = /jpeg|jpg|png|gif/; // Puedes ajustar los tipos de archivo permitidos
		const extname = filetypes.test(file.mimetype);

		if (extname) {
			return cb(null, true);
		} else {
			cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif)"));
		}
	},
});

module.exports = upload;
