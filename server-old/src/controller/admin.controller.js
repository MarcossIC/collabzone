const User = require("../persistencia/models/user.models.js");
const Notification = require("../persistencia/models/notifications.models.js");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config()

// Controlador que busca un usuario por username o email
exports.search_user = async (req, res) => {
  try {
    const email = req.body

    // Verificar que al menos uno de los campos esté presente
    if (!email) {
      return res.status(400).json({
        message: 'Debe proporcionar username o email.'
      });
    }

    // Buscar usuario por username o email, excluyendo la contraseña
    const user = await User.findOne(email).select('-password'); // No incluir la contraseña en la respuesta

    // Verificar si no se encontró el usuario
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado.'
      });
    }

    // Verificar si el usuario ya está asociado a alguna empresa
    if (user.id_emp) {
      return res.status(400).json({
        message: 'El usuario ya está asociado a una empresa.'
      });
    }

    // Enviar los datos del usuario sin la contraseña
    res.status(200).json(user);

  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({
      message: 'Error al buscar el usuario.',
      error: error.message || error
    });
  }
};

// Controlador que asocia un usuario a una empresa
exports.associateUserToCompany = async (req, res) => {
  try {
    const { email } = req.body; // Solo se necesita el userId
    const empresa = req.empresa; // La empresa ya está disponible desde el middleware
    console.log(empresa)
    console.log(req.empresa)
    // Validación: Verificar si la empresa está disponible
    if (!empresa) {
      return res.status(403).json({
        message: 'Acceso denegado. La empresa no está verificada.',
      });
    }

    // Verificar que se proporcione el userId
    if (!email) {
      return res.status(400).json({
        message: 'Debe proporcionar el email.'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado.'
      });
    }

    // Verificar si el usuario ya está asociado a una empresa
    if (user.id_emp) {
      return res.status(400).json({
        message: 'El usuario ya está asociado a una empresa.'
      });
    }

    // Crear notificación para el usuario
    const notification = new Notification({
      user: user._id,
      type: 'invitation',
      message: `Has sido invitado a unirte a la empresa ${empresa.name}. visita la siguiente Direccion`,
    });

    
    
    const savedNotification = await notification.save(); // Guardamos la notificación

    // Generar el token JWT con empId y notificationId
    const tokenPayload = {
      empId: empresa._id, 
      notificationId: savedNotification._id
    };

    const token = jwt.sign(tokenPayload ,process.env.JWT_SECRET,{ expiresIn: '1d' });

    // Actualizar el link de la notificación con el token generado
    savedNotification.link = token;
    await savedNotification.save();

    // Enviar respuesta exitosa
    res.status(200).json({
      message: 'Solicitud Enviada al usuario ',
    });

  } catch (error) {
    console.error('Error al asociar el usuario a la empresa:', error);
    res.status(500).json({
      message: 'Error al asociar el usuario a la empresa.',
      error: error.message || error
    });
  }
};