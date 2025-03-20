import { Clock, Vector2, Vector3, Raycaster } from "three";

import { resizeRendererToDisplaySize } from "./helpers/responsiveness";
import { cleaningSceneOfBlocks } from "./helpers/cleaningscene";
import { Stage } from "./Stage";
import { BlockModel } from "./BlockModel";
import { AudioModel } from "./AudioModel";

import "./styles.css";

const CANVAS_ID = "scene";

class Game {
  canvas = document.querySelector(`canvas#${CANVAS_ID}`);
  levelHtml = document.querySelector("#level2");
  levelInput = document.querySelector("input");
  startHtml = document.querySelector(".start");
  scoreHtml = document.querySelector(".score").children[0];
  soundHtml = document.querySelector(".sound");
  backHtml = document.querySelector(".back");

  // ===== 📈 STATS & CLOCK =====
  clock = new Clock();
  /** Значение таймера на предыдущем кадре */
  _prevTimer = 0;
  delta = 1;
  // количество уровней в пирамиде
  level = 3;
  // размер сетки
  baseGridSize = this.level * 2 + 2;
  // расстояние между блоками (от центра)
  spacing = 1.03;
  // возможные цвета блоков
  colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
  // массив блоков
  grid = [];
  // выбранные пары блоков
  spherePairs = {};
  // последние выбранные пары
  memo = {};
  // счет
  score = 0;
  // звук
  isPlaying = false;
  //анимация
  isMoving = false;

  constructor() {
    this.stage = new Stage(this.canvas);
    this.audio = new AudioModel(this.stage);
    this._init();
  }

  _draw() {
    // Обновляем значения
    this.baseGridSize = this.level * 2 + 2;
    this.grid.length = 0;
    this.score = 0;
    this.spherePairs = {};
    this.memo = {};
    this.scoreHtml.textContent = this.score;
    // ===== 🎨 OBJECTS =====
    for (let l = 0; l < this.level; l++) {
      this.grid[l] = [];
      for (let x = 0; x < this.baseGridSize - l * 2; x++) {
        this.grid[l][x] = [];
        for (let z = 0; z < this.baseGridSize - l * 2; z++) {
          const color =
            this.colors[Math.floor(Math.random() * this.colors.length)];
          const initPosition = new Vector3(
            x * this.spacing -
              ((this.baseGridSize - l * 2) * this.spacing) / 2 +
              this.spacing / 2,
            l * 0.2 + l * 0.03,
            z * this.spacing -
              ((this.baseGridSize - l * 2) * this.spacing) / 2 +
              this.spacing / 2
          );
          const sphere = new BlockModel({
            initPosition,
            color,
          });
          this.stage.scene.add(sphere.mesh);
          this.grid[l][x][z] = { sphere: sphere.mesh, color, initPosition };
        }
      }
    }
  }

  _animate() {
    if (!this.isMoving) {
      return;
    }
    const [left, rigth] = Object.keys(this.spherePairs);
    if (
      this.spherePairs[left].sphere.position.y > 5 &&
      this.spherePairs[rigth].sphere.position.y > 5
    ) {
      this.isMoving = false;
      Object.keys(this.spherePairs).forEach((el) =>
        this.stage.scene.remove(this.spherePairs[el].sphere)
      );
      this.audio.soundAirplane.stop();
      this.score++;
      this.scoreHtml.textContent = this.score;
      this.memo = { ...this.spherePairs };
      this.spherePairs = {};
      this.grid[left[0]][left[1]][left[2]] = null;
      this.grid[rigth[0]][rigth[1]][rigth[2]] = null;
    }
    Object.keys(this.spherePairs).forEach((el) =>
      this.spherePairs[el].sphere.tick(this.delta)
    );
  }

  _init() {
    this.levelHtml.textContent = this.level;
    this.scoreHtml.textContent = this.score;

    // ======= 🏗️ Смена уровней пирамиды ==========
    this.levelInput.addEventListener("click", (elem) => {
      this.level = elem.target.value;
      this.levelHtml.textContent = elem.target.value;
      // удаляем текущею пирамиду
      // cleaningSceneOfBlocks(this.grid, this.stage.scene);
      this.stage.scene.children.length = 3;
      // рисуем новую пирамиду
      this._draw();
    });

    // ===== ⚽ RESTART GAME  =====

    this.startHtml.addEventListener("click", () => {
      // удаляем текущею пирамиду
      this.stage.scene.children.length = 3;
      this._draw();
    });

    // ===== 🎼 AUDIO =====
    this.soundHtml.addEventListener("click", () => {
      if (!this.audio.isPlaying) {
        this.audio.isPlaying = true;
        this.audio.sound.play();
        this.soundHtml.textContent = "🔇 Выключить звук";
      } else {
        this.audio.isPlaying = false;
        this.audio.sound.stop();
        this.soundHtml.textContent = "🎼 Фоновая музыка";
      }
    });

    // ===== 🔙 BACK STEP =====

    this.backHtml.addEventListener("click", () => {
      const [left, rigth] = Object.keys(this.memo);
      this.grid[left[0]][left[1]][left[2]] = this.memo[left];
      this.grid[rigth[0]][rigth[1]][rigth[2]] = this.memo[rigth];

      Object.values(this.memo).forEach((el) => {
        el.sphere.position.set(...el.initPosition);
        el.sphere.rotation.set(0, 0, 0);
        this.stage.scene.add(el.sphere);
      });
      this.score--;
      this.scoreHtml.textContent = this.score;
      this.memo = {};
    });

    // ===== 🎯 SELECT BLOCK =====
    window.addEventListener("click", (event) => {
      const mouse = new Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, this.stage.camera.instance);

      const intersects = raycaster.intersectObjects(this.stage.scene.children);
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const position = clickedObject.position;
        const y = Math.round(position.y / 0.2 + 0.03);
        const x = Math.round(
          (position.x +
            ((this.baseGridSize - y * 2) * this.spacing) / 2 -
            this.spacing / 2) /
            this.spacing
        );
        const z = Math.round(
          (position.z +
            ((this.baseGridSize - y * 2) * this.spacing) / 2 -
            this.spacing / 2) /
            this.spacing
        );
        let key = `${y}${x}${z}`;

        if (
          Object.keys(this.spherePairs).length < 2 &&
          !this.spherePairs[key]
        ) {
          this.grid[y][x][z].sphere.position.y += 0.2;
          this.spherePairs[key] = this.grid[y][x][z];
        }

        if (Object.keys(this.spherePairs).length == 2) {
          const [left, rigth] = Object.keys(this.spherePairs);
          if (this.spherePairs[left].color === this.spherePairs[rigth].color) {
            this.isMoving = true;
            this.audio.soundAirplane.play();
            this.memo = { ...this.spherePairs };
          } else {
            Object.keys(this.spherePairs).forEach(
              (el) => (this.spherePairs[el].sphere.position.y -= 0.2)
            );
            this.spherePairs = {};
            this.audio.soundDanger.play();
          }
        }
      }
    });

    this._draw();
    this.tick();
  }

  /** Запускает покадровую анимацию */
  tick() {
    const elapsedTime = this.clock.getElapsedTime();
    this.delta = elapsedTime - this._prevTimer;
    this._prevTimer = elapsedTime;

    requestAnimationFrame(() => this.tick());
    this._animate();

    if (resizeRendererToDisplaySize(this.stage.renderer)) {
      const canvas = this.stage.renderer.domElement;
      this.stage.camera.instance.aspect =
        canvas.clientWidth / canvas.clientHeight;
      this.stage.camera.instance.updateProjectionMatrix();
    }

    this.stage.renderFrame();
  }
}

// Запуск игры
new Game();
