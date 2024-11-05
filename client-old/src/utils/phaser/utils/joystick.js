export class Joystick {
  scene;
  radius;
  stick;
  base;
  baseX = 0;
  baseY = 0;
  pointerId;
  direction;

  constructor(main, radius) {
    this.scene = main;
    //*Anoto*: El radio es el la distancia entre el centro de una circunferencia y cualquiera de sus bordes
    this.radius = radius;
  }

  create(x, y) {
    // Crear el fondo del joystick
    this.base = this.scene.add
      .circle(x, y, this.radius, 0x888888, 0.5)
      .setInteractive()
      .setScrollFactor(0);

    this.base.setVisible(false);

    // Crear la palanca del joystick
    this.stick = this.scene.add
      .circle(x, y, this.radius / 2, 0xffffff, 0.5)
      .setInteractive()
      .setScrollFactor(0);

    this.stick.setVisible(false);

    // Variables para almacenar la posición inicial
    this.baseX = x;
    this.baseY = y;

    // Variables para almacenar el estado del joystick
    this.pointerId = null;
    this.direction = { x: 0, y: 0 };

    // Manejar los eventos de input
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
  }

  onPointerDown(pointer) {
    if (this.pointerId === null) {
      this.pointerId = pointer.id;
      //La base es la posicion(X, Y) de donde se empezo a clicar
      this.baseX = pointer.x;
      this.baseY = pointer.y;
      //Se mueve el joystick a donde se clico
      this.base.setPosition(pointer.x, pointer.y);
      this.stick.setPosition(pointer.x, pointer.y);
      //Se hace visible el Joystick
      this.base.setVisible(true);
      this.stick.setVisible(true);

      //Se pone el boton en rojo para indicar que esta activo
      this.stick.setFillStyle(0xff0000, 0.5);
    }
  }

  onPointerMove(pointer) {
    if (pointer.id === this.pointerId) {
      //Delta es la distancia entre la posicion actual del puntero
      //Y la base que se inicio en "onPointerDown"
      let deltaX = pointer.x - this.baseX;
      let deltaY = pointer.y - this.baseY;

      //Usando el teorema de pitagoras se calcula,
      //la distancia entre el puntero y el centro del joystick
      // a^2 + b^2 = c^2
      let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      //Si la distancia del puntero es mayor al radio, se limita para evitar que el stick se salga
      if (distance > this.radius) {
        deltaX *= this.radius / distance;
        deltaY *= this.radius / distance;
        distance = this.radius;
      }

      //Se actualiza el stick del joystick
      this.stick.x = this.baseX + deltaX;
      this.stick.y = this.baseY + deltaY;

      //Direccion del movimiento entre X(-1, 1) e Y(-1, 1)
      //"0" == Quieto // >0 = Derecha // <0 = Izquierda
      this.direction.x = deltaX / this.radius;
      //"0" == Quieto // >0 = Abajo // <0 = Arriba
      this.direction.y = deltaY / this.radius;
    }
  }

  onPointerUp(pointer) {
    if (pointer.id === this.pointerId) {
      //Se resetea el puntero y se oculta el joystick
      this.pointerId = null;
      this.base.setVisible(false);
      this.stick.setVisible(false);
      this.stick.setFillStyle(0xffffff, 0.5);
      this.stick.x = this.baseX;
      this.stick.y = this.baseY;
      this.direction.x = 0;
      this.direction.y = 0;
    }
  }

  destroy() {
    // Destruir los elementos y eliminar los eventos (Ayuda a limpiar la cache cuando no se use el joystick)
    if (this.base) this.base.destroy();
    if (this.stick) this.stick.destroy();
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
  }

  getDirection() {
    return this.direction;
  }

  isMovingUp() {
    return this.direction?.y < -0.5;
  }

  isMovingDown() {
    return this.direction?.y > 0.5;
  }
  isMovingRight() {
    return this.direction?.x > 0.5;
  }
  isMovingLeft() {
    return this.direction?.x < -0.5;
  }
}
