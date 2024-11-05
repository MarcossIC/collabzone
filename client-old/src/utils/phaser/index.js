import { AUTO, Game, Scale } from 'phaser';
import { SCENE_MAX_HEIGHT, SCENE_MAX_WIDTH } from './consts';
import { PreloaderScene } from './scenes/PreloaderScene';
import { OfficeScene } from './scenes/OfficeScene';

const config = {
  type: AUTO,
  width: SCENE_MAX_WIDTH,
  height: SCENE_MAX_HEIGHT,
  backgroundColor: '#049cd8',
  parent: 'room',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
  },
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  pixelArt: true,
  scene: [PreloaderScene, OfficeScene],
};

/**
 * Con esta funcion se inicia Phaser
 * El parametro "parent" necesitas pasar el elemento html que contendra la escena
 */
const StartGame = parent => {
  return new Game({ ...config, parent });
};

export default StartGame;
