import { AudioListener, PositionalAudio, AudioLoader } from "three";

export class AudioModel {
  isPlaying = false;
  sound;
  soundDanger;
  soundAirplane;

  constructor(stage) {
    this._stage = stage;

    this.listener = new AudioListener();
    this.sound = new PositionalAudio(this.listener);
    this.soundDanger = new PositionalAudio(this.listener);
    this.soundAirplane = new PositionalAudio(this.listener);
    this.audioLoader = new AudioLoader();
    this._init();
  }

  _init() {
    this._stage.camera.instance.add(this.listener);
    const self = this;
    // ===== 🎼 AUDIO =====
    this.audioLoader.load(
      "mahjong/audio/nature.ogg",
      function (buffer) {
        self.sound.setBuffer(buffer);
        self.sound.setLoop(true);
        self.sound.setVolume(0.7);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (err) {
        console.log("An error happened", err);
      }
    );

    this.audioLoader.load(
      "mahjong/audio/danger.mp3",
      function (buffer) {
        self.soundDanger.setBuffer(buffer);
        self.soundDanger.setVolume(0.7);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (err) {
        console.log("An error happened", err);
      }
    );

    this.audioLoader.load(
      "mahjong/audio/airplane.wav",
      function (buffer) {
        self.soundAirplane.setBuffer(buffer);
        self.sound.setLoop(true);
        self.soundAirplane.setVolume(0.7);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (err) {
        console.log("An error happened", err);
      }
    );
  }
}
