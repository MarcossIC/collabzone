const Emp = require('../persistencia/models/emp.models.js');
const User = require("../persistencia/models/user.models.js")
const Rooms = require("../persistencia/models/rooms.models.js")
const crip = require("bcryptjs");
const { createAccess } = require("../utils/createAcesstoken.js");
const nodemailer = require('nodemailer');
const verifyAccessToken = require("../utils/verifyAccessToken.js")

const registerEmp = async (req, res) => {
    const { domain, name, email, password } = req.body;
    try {
        const empex = await Emp.findOne({ name });
        if (empex) {
            return res.status(409).json({
                code: 409,
                data: [],
                status: 'error',
                message: `El username ${name} ya está en uso`
            });
        }
        const empemail = await Emp.findOne({ email });
        if (empemail) {
            return res.status(409).json({
                code: 409,
                data: [],
                status: 'error',
                message: "El email ya está registrado"
            });
        }
        const hash = await crip.hash(password, 10);
        const newEmp = new Emp({
            email,
            password: hash,
            name,
            domain,
        });

        const rEmp = await newEmp.save();

        // Genera un token de verificación
        const verifyToken = await createAccess({ id: rEmp.id, email: rEmp.email });

        // Configura el transporte de correo
        let transporter = nodemailer.createTransport({
            service: 'gmail', // o tu servicio de correo
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Envío del correo de confirmación
        const verifyLink = `${process.env.FRONTEND}/verify-email?token=${verifyToken}`;
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Confirma tu correo electrónico',
            text: `Hola ${name}, confirma tu correo usando el siguiente enlace: ${verifyLink}`,
            html: `<b>Hola ${name}</b>,<br><br>Confirma tu correo haciendo click en el siguiente enlace:<br><a href="${verifyLink}">Verificar correo</a>`
        });

        return res.status(201).json({
            code: 201,
            data: {
                id: rEmp.id,
                name: rEmp.name,
                email: rEmp.email,
                domain: rEmp.domain
            },
            status: 'success',
            message: 'Usuario registrado. Confirma tu correo electrónico.'
        });

    } catch (err) {
        return res.status(500).json({
            code: 500,
            data: [],
            status: 'error',
            message: err.message
        });
    }
};

const confirmEmail = async (req, res) => {
    const { token } = req.query;
    try {
        // Verifica el token de confirmación
        const decoded = await verifyAccessToken(token);
        const userId = decoded.id;

        // Actualiza el estado de verificación del usuario
        const user = await Emp.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado o ya verificado.' });
        }

        return res.status(200).json({
            message: 'Correo verificado con éxito',
            data: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Enlace de verificación inválido o expirado.',
            error: err.message
        });
    }
};

const loginEmp = async (req, res) => {
    const { email, password } = req.body
    const exEmp = await Emp.findOne({ "email": email })
    if (!exEmp) {
        return res.status(409).json({ message: "email no register" })
    }
    try {
        const compareHash = await crip.compare(password, exEmp.password)
        if (!compareHash) {
            return res.status(401).json({ message: "Invalid credentials" })
        };
        // const token = await createAccess({ id: exEmp.id })
        const token = createAccess({ empId: exEmp._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({
            id: exEmp.id,
            email: exEmp.email,
            name: exEmp.name,
            domain: exEmp.domain,
            token: token
        })
    } catch (err) {
        res.status(500).json({ message: error.message })
    }
};

const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Emp.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'El email no está registrado.' });
        }

        // Genera un token para el restablecimiento de contraseña
        const resetToken = await createAccess({ id: user.id, email: user.email });

        // Configura el transporte de correo
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // Envío del correo de recuperación
        const resetLink = `${process.env.FRONTEND}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Restablecer tu contraseña',
            text: `Hola, restablece tu contraseña usando este enlace: ${resetLink}`,
            html: `<b>Hola</b>,<br><br>Puedes restablecer tu contraseña haciendo click en el siguiente enlace:<br><a href="${resetLink}">Restablecer contraseña</a>`
        });

        return res.status(200).json({
            message: 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico.'
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Error enviando el correo de recuperación.',
            error: err.message
        });
    }
};

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        const decoded = await verifyAccessToken(token);
        const userId = decoded.id;

        // Encripta la nueva contraseña
        const hashedPassword = await crip.hash(newPassword, 10);

        // Actualiza la contraseña del usuario
        await Emp.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ message: 'Contraseña actualizada con éxito.' });

    } catch (err) {
        return res.status(400).json({
            message: 'Enlace de restablecimiento inválido o expirado.',
            error: err.message
        });
    }
};

const createPermissions = async (req, res) => {
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    const { permissions}= req.body
    try {
        const pre = await Emp.findById(empId)
        if (!pre) { return res.status(404).json({ message: 'not existent ' }); }
        if (!pre.permissions_emp.includes(permissions)) {
            pre.permissions_emp.push(permissions);
        } else {
            return res.status(400).json({ message: 'Permission already exists' });
        }
        await pre.save();

        return res.status(200).json({
            message: 'Permissions created', permissions: pre.permissions_emp
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const assignUPermissions = async (req, res) => {
    const { permissions, id_user } = req.body
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    try {
        const pre = await Emp.findById(empId)
        if (!per) { return res.status(404).json({ message: 'nonexistent emp' }); }
        const user = await User.findById(id_user)
        if (!user) { return res.status(404).json({ message: 'nonexistent user' }); }
        if (!(user.id_emp == empId)) { return res.status(404).json({ message: 'not permit' }); }
        if (!pre.permissions_emp.includes(permissions)) { return res.status(404).json({ message: 'Permissions no create' }); }
        if (!user.permissions.includes(permissions)) {
            user.permissions.push(permissions);
        } else {
            return res.status(400).json({ message: 'Permission already exists' });
        }
        await user.save();
        return res.status(200).json({
            message: 'add permit', user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const assignRPermissions = async (req, res) => {
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    const { permissions, id_room } = req.body
    try {
        const pre = await Emp.findById(empId)
        if (!pre) { return res.status(404).json({ message: 'not existent ' }); }
        const room = Rooms.findById(id_room)
        if (!room) { return res.status(404).json({ message: 'nonexistent room' }); }
        if (room.id_emp == empId) { return res.status(404).json({ message: 'nonexistent room' }); }
        if (!pre.permissions_emp.includes(permissions)) { return res.status(404).json({ message: 'Permissions no create' }); }
        if (!room.permissions.includes(permissions)) {
            room.permissions.push(permissions);
        } else {
            return res.status(400).json({ message: 'Permission already exists' });
        }
        room.save();
        return res.status(200).json({
            message: 'add permit', room: room
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const viewusers = async (req, res) => {
    
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    try {
        const users = await User.find({ id_emp: empId })
            .select("username profilePicture status socketId");

        const usersWithRoomInfo = await Promise.all(users.map(async (user) => {
            const room = await Rooms.findOne({ "users.socketId": user.socketId });
            return {
                id: user._id,
                username: user.username || "",
                profilePicture: user.profilePicture || "",
                status: user.status || "offline",
                inRoom: !!room, 
                roomId: room ? room._id : null, 
                roomName: room ? room.name : null, 
            };
        }));

        return res.status(200).json({
            users: usersWithRoomInfo
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const pview = async (req, res) => {
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    try {
        const empresa = await Emp.findById(empId)
        if (!empresa){
            return res.status(400).json({ message: 'Enp not exist' });
        }
        return res.status(200).json(empresa.permissions_emp);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const pdelete = async (req, res) => {
    const { permissions } = req.body
    const empId = req.user ? req.user.id_emp : req.empresa.id;
    try {
        const pre = await Emp.findById(empId)
        if (!pre.permissions_emp.includes(permissions)){
            return res.status(400).json({ message: 'permissions no exist' });
        }
        const empresa = await Emp.findByIdAndUpdate(empId,
            { $pull: { permissions_emp: permissions } },
            { new: true }
        )
        if (!empresa) {
            return res.status(400).json({ message: 'Enp not exist' });
        }
        return res.status(204).json(empresa);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    pdelete,
    pview,
    registerEmp,
    loginEmp,
    confirmEmail,
    sendResetPasswordEmail,
    resetPassword,
    createPermissions,
    assignUPermissions,
    assignRPermissions,
    viewusers
};
