import { Vector3, BoxGeometry, MeshStandardMaterial, Mesh } from "three";

/** Размеры блоков */
const BASE_BLOCK_SIZE = {
  width: 1,
  height: 0.2,
  depth: 1,
};

const COLOR = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

export class BlockModel {
  flag = 5;
  constructor({
    width = BASE_BLOCK_SIZE.width,
    height = BASE_BLOCK_SIZE.height,
    depth = BASE_BLOCK_SIZE.depth,
    initPosition = new Vector3(0, 0, 0),
    color = COLOR[0],
  }) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.geometry = new BoxGeometry(this.width, this.height, this.depth);
    this.material = new MeshStandardMaterial({
      color,
      metalness: 0.5,
      roughness: 0.7,
    });

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(...initPosition);
    this.mesh.tick = (delta) => {
      if (this.mesh.position.y > this.flag / 2) {
        this.mesh.position.x += delta / Math.random();
      }
      this.mesh.position.y += delta;
      this.mesh.rotation.x += delta / Math.random();
      this.mesh.rotation.y += delta / Math.random();
      this.mesh.rotation.z += delta / Math.random();
    };
  }
}
