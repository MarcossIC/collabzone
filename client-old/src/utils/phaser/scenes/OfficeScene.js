import { Scene, Input, Math, Geom } from 'phaser';
import { ASSETS_KEYS, SCENE_KEYS, PLAYER_KEYS } from '../consts';
import { Joystick } from '../utils/joystick';
import { EventBus } from '../EventBus';

const colors = [
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
  const indiceAleatorio = Math.FloorTo(window.Math.random() * colors.length, 0, 10);
  return colors[indiceAleatorio];
}

export class OfficeScene extends Scene {
  player;
  keys;
  map;
  idleFrame;
  otherPlayers;
  groundHouseLayer;
  grassLayer;
  joystick;
  socket;
  playerName;

  constructor() {
    super(SCENE_KEYS.GAME);
    // El idleFrame son los frames del sprite que tiene que usar cuando esta quieto segun la direccion que mira
    this.idleFrame = {
      down: 23,
      left: 10,
      right: 2,
      up: 31,
    };
    this.players = new Map();
  }

  init() {
    this.initializeScale();
    this.otherPlayers = this.physics.add.group();
  }

  create() {
    this.createMap();
    this.createAnimations();
    // Eventos
    //this.setupSocketListeners();
    this.createInputs();
    this.setupEventListeners();

    /* 
    // Modd DEBUG
    this.physics.world.createDebugGraphic();
    const debugGraphics = this.add.graphics().setAlpha(0.7);
     this.groundHouseLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243, 134, 48, 255),
      faceColor: new Display.Color(40, 39, 37, 255),
    });

    // Habilitar debug para el jugador
    this.player.setDebug(true, true, 0x00ff00);

    // Habilitar debug para el groundLayer
    
    groundLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Display.Color(243, 134, 48, 255),
      faceColor: new Display.Color(40, 39, 37, 255),
    });
    */
    EventBus.emit(SCENE_KEYS.SCENE_READY, this);
  }
  initializeScale() {
    this.scale.parentIsWindow = false;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = 3;
    this.scale.refresh();
  }

  createInputs() {
    //Solo se escuchan los eventos de teclados requeridos y no todo el resto
    const { LEFT, RIGHT, UP, DOWN, W, A, S, D } = Input.Keyboard.KeyCodes;
    this.keys = this.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      a: A,
      s: S,
      d: D,
    });
    // Se inicializa el Joystick
    this.joystick = new Joystick(this, 50);
  }
  setupEventListeners() {
    this.scale.on('resize', this.resize, this);
    this.input.on('mousemove', this.onMouseMove, this);
    this.input.on('wheel', (_, __, ___, deltaY) => this.handleZoom(deltaY));
    this.input.on('pinch', pinch => this.handleZoom((1 - pinch.scaleFactor) * 200));
  }

  handleZoom(delta) {
    let zoom = this.cameras.main.zoom;
    // Zoom in (acercar)
    if (delta > 0 && zoom < 1.75) {
      this.cameras.main.zoom = Math.RoundTo(zoom + 0.05, -2);
    }
    // Zoom out (alejar)
    else if (delta < 0 && zoom > 1) {
      this.cameras.main.zoom = Math.RoundTo(zoom - 0.05, -2);
    }
  }
  onMouseMove() {
    if (
      this.touchAvailable &&
      !('ontouchstart' in window) &&
      navigator.maxTouchPoints === 0
    ) {
      this.joystick.destroy();
    } else {
      this.joystick.create(100, this.scale.height - 100);
    }
  }

  createMap() {
    const map = this.make.tilemap({ key: ASSETS_KEYS.MAP });
    const grassTs = map.addTilesetImage(
      ASSETS_KEYS.GRASS_TILE,
      ASSETS_KEYS.GRASS_IMG
    );
    const stairTs = map.addTilesetImage(
      ASSETS_KEYS.STAIR_TILE,
      ASSETS_KEYS.STAIR_IMG
    );
    const terrainSet3Ts = map.addTilesetImage(
      ASSETS_KEYS.TERRAIN_SET3_TILE,
      ASSETS_KEYS.TERRAIN_SET3_IMG
    );
    const houseTs = map.addTilesetImage(
      ASSETS_KEYS.HOUSE_TILE,
      ASSETS_KEYS.HOUSE_IMG
    );

    this.grassLayer = map.createLayer(ASSETS_KEYS.GRASS_LAYER, grassTs, 0, 0);
    this.groundHouseLayer = map.createLayer(
      ASSETS_KEYS.GROUND_HOUSE_LAYER,
      [stairTs, terrainSet3Ts, houseTs],
      0,
      0
    );

    this.grassLayer.setScale(1);
    this.groundHouseLayer.setScale(1);
    this.grassLayer.setCollisionByProperty({ collides: true });
    this.groundHouseLayer.setCollisionByProperty({ collides: true });
    this.groundHouseLayer.setCollisionFromCollisionGroup(true, false, terrainSet3Ts);
    this.groundHouseLayer.setCollisionFromCollisionGroup(true, false, houseTs);
  }

  createAnimations() {
    this.physics.enableUpdate();
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height);
    this.cameras.main.zoom = 1;
    const animations = {
      [PLAYER_KEYS.WALK_TO_LEFT]: [10, 11, 12, 13, 14, 15, 8, 9],
      [PLAYER_KEYS.WALK_TO_RIGHT]: [2, 3, 4, 5, 6, 7, 0, 1],
      [PLAYER_KEYS.WALK_TO_DOWN]: [23, 16, 17, 18, 19, 20, 21, 22],
      [PLAYER_KEYS.WALK_TO_UP]: [31, 24, 25, 26, 27, 28, 29, 30],
    };

    Object.entries(animations).forEach(([key, frames]) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(ASSETS_KEYS.PLAYER, { frames }),
        frameRate: 16,
        repeat: -1,
      });
    });
  }

  setupSocketListeners(roomId) {
    this.socket.on('connect', () => {
      console.log('Me conecte');
      this.socket.emit('joinRoom', { roomId, x: 350, y: 500 });
    });

    // UserList equivalente a currentPlayers
    this.socket.on('userList', players => {
      console.log('La lista de usuarios eS: ', { players });
      Object.values(players).forEach(playerInfo => {
        const userId = playerInfo['userId'];
        const socketId = playerInfo['socketId'];

        if (!this.players.has(userId)) {
          this.addPlayer(
            {
              id: userId,
              socketId: socketId,
              x: playerInfo.x,
              y: playerInfo.y,
              username: playerInfo.username || 'Guest',
              colors: getPlayerColor(),
            },
            socketId === this.socket.id
          );
        }
      });
    });

    this.socket.on('newUserJoined', playerInfo => {
      const userId = playerInfo['userId'];
      const socketId = playerInfo['socketId'];
      console.log('Se conecto:', { playerInfo });
      if (!this.players.has(userId)) {
        this.addPlayer({
          id: userId,
          socketId: socketId,
          x: playerInfo.x,
          y: playerInfo.y,
          username: playerInfo.username || 'Guest',
          colors: getPlayerColor(),
        });
      }
    });

    //Recupera el numero de jugadores activos
    this.socket.on('userCountUpdate', count => {
      console.log(`La sala tiene ${count} jugadores`);
    });

    // UserLeft no estoy seguro ??
    // La ides es que cuando un jugar cambie de sala se notifica la salida de la anterior
    this.socket.on('userLeft', playerInfo => {
      const userId = playerInfo['user'];
      if (this.players.has(userId)) {
        this.removePlayer(userId);
      }
    });

    this.socket.on('userMoved', playerInfo => {
      const socketId = playerInfo.socketId;
      if (socketId !== this.socket.id) {
        this.updatePlayerPosition(playerInfo);
      }
    });
  }

  updatePlayerPosition(playerInfo) {
    if (this.players.has(playerInfo.userId)) {
      const { sprite, name } = this.players.get(playerInfo.userId);
      sprite.setPosition(playerInfo.x, playerInfo.y);
      name.setPosition(playerInfo.x, playerInfo.y + 10);
      this.updatePlayerAnimation(
        sprite,
        playerInfo.direction,
        playerInfo.prevDirection
      );
    }
  }

  updatePlayerAnimation(sprite, lastMove, prevMove) {
    // Si el ultimo movimiento no fue "idle" (idle == estar quieto)
    if (lastMove && lastMove !== 'idle') {
      sprite.anims.play(PLAYER_KEYS[`WALK_TO_${lastMove.toUpperCase()}`], true);
    } else {
      sprite.anims.stop();
      sprite.setFrame(this.idleFrame[prevMove] || this.idleFrame.down);
    }
  }

  removePlayer(id) {
    if (this.players.has(id)) {
      const { sprite, name } = this.players.get(id);
      sprite.destroy();
      name.destroy();
      this.players.delete(id);
    }
  }

  addPlayer(playerInfo, isMainPlayer = false) {
    const player = this.createPlayerSprite(playerInfo);
    const playerName = this.createPlayerName(playerInfo);
    playerName.id = playerInfo.id;
    if (isMainPlayer) {
      this.player = player;
      this.playerName = playerName;
      this.cameras.main.startFollow(player, true, 0.8, 0.8);
    } else {
      player.setTint(playerInfo.color);
      this.otherPlayers.add(player);
    }

    this.players.set(playerInfo.id, { sprite: player, name: playerName });
  }

  createPlayerSprite(playerInfo) {
    const player = this.physics.add
      .sprite(playerInfo?.x || 0, playerInfo?.y || 0, ASSETS_KEYS.PLAYER)
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setGravityY(0)
      .setSize(15.5, 16)
      .setOffset(32.25, 32)
      .setScale(1.8, 1.8)
      .setInteractive(
        new Geom.Rectangle(32.25, 32, 15.5 * 1.8, 16 * 1.8),
        Geom.Rectangle.Contains
      );

    player.open = false;
    player.socketId = playerInfo.socketId;
    player.id = playerInfo.id;
    player.on('pointerdown', _ => {
      this.players.forEach((otherPlayer, key) => {
        if (key !== playerInfo.id && otherPlayer.sprite.open) {
          otherPlayer.sprite.open = false;
        }
      });
      let isPlayerInfoClose = !player.open;
      player.open = isPlayerInfoClose;
      EventBus.emit('playerCLICKED', { ...playerInfo, open: isPlayerInfoClose });
    });

    player.id = playerInfo.id;
    this.physics.add.collider(player, [this.grassLayer, this.groundHouseLayer]);
    player.setFrame(this.idleFrame.down);

    return player;
  }
  createPlayerName(playerInfo) {
    //.setOrigin(-1.13, 2.5)
    return this.add
      .text(playerInfo?.x, playerInfo?.y, playerInfo?.username, {
        font: '16px Arial',
        fill: '#ffffff',
        stroke: '#1010108a',
        strokeThickness: 3,
      })
      .setOrigin(0.5, 1)
      .setPosition(playerInfo.x, playerInfo.y + 10);
  }

  resize(gameSize) {
    if (this.cameras.main) {
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    }
    if (this.player) {
      this.cameras.main.startFollow(this.player, true);
    }
    if (
      !!this.joystick &&
      (this.game.device.input.touch ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0)
    ) {
      this.joystick.create(100, this.scale.height - 100);
    } else {
      this.joystick.destroy();
    }
  }

  update(time, delta) {
    if (this.player) this.updatePlayerMovement();
  }
  updatePlayerMovement() {
    const speed = 125;
    const previousVelocity = this.player.body.velocity.clone();
    this.player.body.setVelocity(0);

    const movements = [
      {
        key: 'left',
        condition:
          this.keys.left.isDown ||
          this.keys.a.isDown ||
          this.joystick?.isMovingLeft(),
        velocity: { x: -speed, y: 0 },
      },
      {
        key: 'right',
        condition:
          this.keys.right.isDown ||
          this.keys.d.isDown ||
          this.joystick?.isMovingRight(),
        velocity: { x: speed, y: 0 },
      },
      {
        key: 'up',
        condition:
          this.keys.up.isDown || this.keys.w.isDown || this.joystick?.isMovingUp(),
        velocity: { x: 0, y: -speed },
      },
      {
        key: 'down',
        condition:
          this.keys.down.isDown ||
          this.keys.s.isDown ||
          this.joystick?.isMovingDown(),
        velocity: { x: 0, y: speed },
      },
    ];

    const currentMove = movements.find(m => m.condition);
    if (currentMove) {
      this.player.body.setVelocity(currentMove.velocity.x, currentMove.velocity.y);
      this.player.anims.play(
        PLAYER_KEYS[`WALK_TO_${currentMove.key.toUpperCase()}`],
        true
      );
      this.playerName.setPosition(this.player.x, this.player.y);
    } else {
      this.player.anims.stop();
      this.setIdleFrame(previousVelocity);
    }

    this.player.body.velocity.normalize().scale(speed);
    this.emitPlayerMovement(currentMove?.key || 'idle');
  }

  emitPlayerMovement(direction) {
    const { x, y, oldPosition } = this.player;
    const prevDirection = oldPosition?.direction || 'down';

    const isIdleIdle = direction === 'idle' && prevDirection === 'idle';
    if (this.hasPositionChanged(direction, [x, y], oldPosition) && !isIdleIdle) {
      this.socket.emit('updatePosition', {
        x,
        y,
        direction: direction,
        prevDirection,
      });
    }
    this.player.oldPosition = { x, y, direction: direction };
  }

  hasPositionChanged(dir, [x, y], oldPosition) {
    return (
      oldPosition &&
      (x !== oldPosition.x || y !== oldPosition.y || dir !== oldPosition.direction)
    );
  }
  setIdleFrame(previousVelocity) {
    if (previousVelocity.x < 0) this.player.setFrame(this.idleFrame.left);
    else if (previousVelocity.x > 0) this.player.setFrame(this.idleFrame.right);
    else if (previousVelocity.y < 0) this.player.setFrame(this.idleFrame.up);
    else if (previousVelocity.y > 0) this.player.setFrame(this.idleFrame.down);
  }

  shutdown() {
    this.joystick?.destroy();
    this.players.forEach(({ sprite, name }) => {
      sprite.destroy();
      name.destroy();
    });
    this.players.clear();
    this.events.removeAllListeners();
  }
}
