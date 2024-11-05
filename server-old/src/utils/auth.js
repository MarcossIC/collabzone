const User = require('../persistencia/models/user.models');
const mongoose = require('mongoose');

/**
 * Callback para gestionar la autenticación.
 * Si el usuario no existe, se crea automáticamente en la base de datos.
 * @param {Object} userInfo - Información del usuario proporcionada por el proveedor de autenticación.
 */

const handleUserLogin = async (userInfo) => {
    try {
        const { email, picture, nickname, email_verified, sub, provider, name, given_name, family_name } = userInfo;

        // Busca al usuario por su email
        let user = await User.findOne({ email });

        if (!user) {
            // Si el usuario no existe, crea uno nuevo
            const newUser = new User({
                username: nickname || given_name + ' ' + family_name, // Usar nombre completo o nickname
                email,
                picture: picture || '', // Usar la imagen proporcionada
                email_verified: email_verified || false,
                providers: [
                    {
                        providerId: sub,
                        providerName: provider || 'Auth0', // Cambia 'Auth0' si es necesario
                        email,
                        nickname,
                        picture,
                        emailVerified: email_verified || false,
                    },
                ],
                rol: 'user', // Ajusta según tus necesidades
                status: 'active',
                updated_at: new Date(), // Fecha de actualización
            });

            user = await newUser.save();
            console.log(`Usuario creado: ${user.username}`);
        } else {
            // Si el usuario existe, verifica si el proveedor ya está agregado
            const existingProvider = user.providers.find(p => p.providerId === sub);

            if (!existingProvider) {
                user.providers.push({
                    providerId: sub,
                    providerName: provider || 'Auth0',
                    email,
                    nickname,
                    picture,
                    emailVerified: email_verified || false,
                });
                await user.save();
                console.log(`Proveedor agregado para el usuario: ${user.username}`);
            } else {
                console.log(`El proveedor ya existe para el usuario: ${user.username}`);
            }
        }

        return user; // Devuelve el usuario creado o encontrado
    } catch (error) {
        console.error('Error al manejar la autenticación:', error);
        throw new Error('No se pudo gestionar el inicio de sesión.');
    }
};


module.exports = { handleUserLogin };
