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
      "https://cdn.freesound.org/previews/791/791115_5287430-lq.mp3",
      function (buffer) {
        self.sound.setBuffer(buffer);
        self.sound.setLoop(true);
        self.sound.setVolume(0.7);
      }
    );

    this.audioLoader.load(
      "https://cdn.freesound.org/previews/734/734432_2733407-lq.mp3",
      function (buffer) {
        self.soundDanger.setBuffer(buffer);
        self.soundDanger.setVolume(0.7);
      }
    );

    this.audioLoader.load(
      "https://cdn.freesound.org/previews/707/707869_12340115-lq.mp3",
      function (buffer) {
        self.soundAirplane.setBuffer(buffer);
        self.sound.setLoop(true);
        self.soundAirplane.setVolume(0.7);
      }
    );
  }
}
