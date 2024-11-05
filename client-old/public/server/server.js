const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // Permitir todos los orígenes
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['my-custom-header'], // Aquí puedes agregar tus encabezados personalizados
    credentials: true, // Permitir credenciales si es necesario
  },
});

app.use(cors());
app.use(express.static('public'));

const players = {};
const colores = [
  0xff0000, // Rojo
  0x00ff00, // Verde
  0x0000ff, // Azul
  0x808080, // Gris
  0xffff00, // Dorado (amarillo)
  0x00ffff, // Celeste (cian)
  0x800080, // Morado
  0xff69b4, // Rosado (Hot Pink)
];

function getPlayerColor() {
  const indiceAleatorio = Math.floor(Math.random() * colores.length);
  return colores[indiceAleatorio];
}

io.on('connection', socket => {
  // Crear un nuevo jugador
  players[socket.id] = {
    x: 350,
    y: 500,
    playerId: socket.id,
    username: 'Guest',
    color: getPlayerColor(),
  };

  console.log(
    `⚡: Un jugador se ha conectado. Jugadores en sala: ${Object.keys(players).length}`
  );

  // Enviar los jugadores existentes al nuevo jugador
  socket.emit('currentPlayers', players);

  // Actualizar a todos los demás clientes sobre el nuevo jugador
  socket.broadcast.emit('newPlayer', players[socket.id]);

  // Cuando un jugador se desconecta, elimínalo del juego
  socket.on('disconnect', () => {
    console.log('🔥: Un jugador se ha desconectado');
    delete players[socket.id];
    io.emit('disconnectPlayer', socket.id);
  });

  // Cuando un jugador se mueve, actualiza su posición
  socket.on('playerMovement', movementData => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].prevMoveTo = movementData.prevDirection;
    players[socket.id].lastMoveTo = movementData.direction;
    socket.broadcast.emit('playerMoved', players[socket.id]);
  });
});

const PORT = process.env.PORT || 4444;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

