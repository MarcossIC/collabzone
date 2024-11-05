import { Scene } from 'phaser';
import { SCENE_KEYS, ASSETS_KEYS } from '../consts';

export class PreloaderScene extends Scene {
  constructor() {
    // Aqui se define el ID / key de la escena
    // Es un string que se utiliza para identificar la escena
    super(SCENE_KEYS.PRELOADER);
  }

  preload() {
    this.createLoadingBar();
    // En esta funcion se agregan los assets necesarios para la escena
    this.load.image(ASSETS_KEYS.GRASS_IMG, '/room/images/GRASS TILE - DAY.png');
    this.load.image(ASSETS_KEYS.STAIR_IMG, '/room/images/STAIRS - DAY.png');
    this.load.image(
      ASSETS_KEYS.TERRAIN_SET3_IMG,
      '/room/images/TERRAIN SET 3 - DAY.png'
    );
    this.load.image(ASSETS_KEYS.HOUSE_IMG, '/room/images/HOUSE 1 - DAY.png');
    this.load.tilemapTiledJSON(ASSETS_KEYS.MAP, '/room/room.json');
    /* 
    Ejemplo de como cargar un Sprite
    */
    this.load.spritesheet(ASSETS_KEYS.PLAYER, '/images/sprites/walk.png', {
      frameWidth: 80,
      frameHeight: 80,
      startFrame: 0,
    });

    this.load.on('progress', this.updateBar, this);
    this.load.on('complete', this.complete, this);
  }

  create() {
    // En esta funcion se define las funciones que tiene la escena

    // En este caso la escena "Preloader" sirve para precargar sprites una vez que termina
    // Se inicia la escena "Game"
    this.scene.start(SCENE_KEYS.GAME);
  }

  /**
   * Crea una barra de progreso en la pantalla
   * @function
   * @instance
   */
  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 0.8);
    this.loadingBar.fillRect(width / 4, height / 2 - 25, width / 2, 50);

    this.progressBar = this.add.graphics();
  }

  /**
   * Actualiza la barra de progreso
   * @param {number} value entre 0 y 1 que indica el progreso
   */
  updateBar(value) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.progressBar.clear();
    this.progressBar.fillStyle(0x00ff00, 1);
    this.progressBar.fillRect(width / 4, height / 2 - 25, (width / 2) * value, 50);
  }

  /**
   * Se llama cuando se completa el preloader
   * Destruye los elementos de la barra de progreso y comienza la escena "OfficeScene"
   */
  complete() {
    this.progressBar.destroy();
    this.loadingBar.destroy();
  }
}
