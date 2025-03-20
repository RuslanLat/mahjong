import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class CameraModel {
  /** Обзор камеры */
  _viewDistance = 50;

  /** Насколько близко видит камера */
  _near = 0.1;

  /** Насколько далеко видит камера */
  _far = 100;

  /** Начальное положение камеры */
  _initialPosition = new Vector3(2, 3, 12);

  constructor(stage, canvas) {
    this._stage = stage;

    this.instance = new PerspectiveCamera(
      this._viewDistance,
      this._stage.aspectRatio,
      this._near,
      this._far
    );

    this.cameraControls = new OrbitControls(this.instance, canvas);

    this._init();
  }

  _init() {
    this.instance.position.set(...Object.values(this._initialPosition));
    this._stage.scene.add(this.instance);
    // ===== 🕹️ CONTROLS =====
    this.cameraControls.enableDamping = true;
    this.cameraControls.autoRotate = false;
    this.cameraControls.update();
  }

  /** Обновляет обзор камеры */
  update() {
    // this.instance.left = this._viewDistance * -1 * this._stage.aspectRatio;
    // this.instance.right = this._viewDistance * this._stage.aspectRatio;

    // this.instance.updateProjectionMatrix();
    this.cameraControls.update();
  }
}
