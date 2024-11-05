const express = require('express')
const http = require('node:http')
const path = require('node:path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { authMiddleware } = require('./src/config/authConfig.js')
const roomRoutes = require('./src/router/rooms.routes.js')
const vsRoutes = require('./src/router/vsactivity.routes.js')
const empRoutes = require('./src/router/emp.routes.js')
const userRoutes = require('./src/router/user.routes.js')
const chatRoutes = require('./src/router/chat.routes.js')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerOptions = require('./src/docs/swaggerOptions.js')
const swaggerDocs = swaggerJsdoc(swaggerOptions)
const authRoutes = require('./src/router/auth.routes.js')
const connectDB = require('./src/config/dbConfig.js')
const adminRoutes = require('./src/router/admin.routes.js')
const notificationRoutes = require('./src/router/notifications.routes.js')

const { Server } = require('socket.io')
//const socketAuth = require("./src/middlewares/socketAuth.js");
//const { handleSocketEvents } = require("./src/sockets/roomIo.js");

const app = express()

app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs')

// Midleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(authMiddleware)

const server = http.createServer(app)
// Configura CORS abierto
// Configuración de CORS para permitir Swagger UI acceder a tu API

const corsOptions = {
	origin: [
		'http://localhost:8080',
		'https://s18-01-ft-react.onrender.com',
		'http://localhost:3000',
		'http://localhost:5173',
		'https://no-countrys18.up.railway.app',
		'https://no-countrys18.netlify.app',
	],
	credentials: true, // Permite cookies y autenticación
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	preflightContinue: false, // Maneja automáticamente la solicitud OPTIONS
	optionsSuccessStatus: 204, // Estado para solicitudes preflight exitosas
}

app.use(cors(corsOptions))


connectDB()

// Ruta principal (índice)
app.get('/', (req, res) => {
	res.render('index') // Renderiza el archivo index.ejs
})

// Routers
app.use('/auth', authRoutes)
app.use('/rooms', roomRoutes)
app.use('/vs', vsRoutes)
app.use('/emp', empRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)
app.use('/notifications', notificationRoutes)
app.use('/chat', chatRoutes)

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use((req, res, next) => {
	res.status(404).json({ message: 'Ruta no encontrada' })
})

// Manejador de errores
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	res.status(err.status || 500)
	res.render('error', { errorMessage: err.message }) // Asegúrate de que "error" coincide con tu archivo de vista
})

module.exports = app
