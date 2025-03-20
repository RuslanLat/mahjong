import {
  Scene,
  AmbientLight,
  PointLight,
  WebGLRenderer,
  PCFSoftShadowMap,
} from "three";

import { CameraModel } from "./CameraModel";

export class Stage {
  /** Размеры холста */
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /** Сцена Three.js */
  scene = new Scene();

  /** Источники света */
  ambientLight = new AmbientLight("white", 0.4);
  pointLight = new PointLight("white", 20, 100);

  constructor(canvas) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.canvas = canvas;
    this.camera = new CameraModel(this, canvas);
    this._onResizeBound = this._onResize.bind(this);

    this._init();
  }

  /** Соотношение сторон холста */
  get aspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  _init() {
    // Настраиваем рендер
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    // Добавляем на сцену источники света
    this.pointLight.position.set(-2, 2, 2);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.radius = 4;
    this.pointLight.shadow.camera.near = 0.5;
    this.pointLight.shadow.camera.far = 4000;
    this.pointLight.shadow.mapSize.width = this.canvas.clientWidth;
    this.pointLight.shadow.mapSize.height = this.canvas.clientHeight;

    this.scene.add(this.pointLight, this.ambientLight);

    // Задаем первоначальные настройки рендерера
    this._updateRenderer();

    // Подписываемся на изменение размеров окна
    window.addEventListener("resize", this._onResizeBound);
  }

  /** Обновляет размеры холста */
  _onResize() {
    this.sizes.width = this.canvas.clientWidth;
    this.sizes.height = this.canvas.clientHeight;

    // this.camera.update();

    this._updateRenderer();
  }

  /** Обновляет настройки рендерера */
  _updateRenderer() {
    const canvas = this.renderer.domElement;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /** Отрисовывает текущий кадр */
  renderFrame() {
    this.renderer.render(this.scene, this.camera.instance);
    this.camera.update();
  }

  /** Отписывается от слушателей */
  destroy() {
    window.removeEventListener("resize", this._onResizeBound);
  }
}
