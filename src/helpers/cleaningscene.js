export function cleaningSceneOfBlocks(grid, scene) {
  grid.forEach((level) => {
    level.forEach((row) => {
      row.forEach((col) => {
        if (col) {
          scene.remove(col.sphere);
        }
      });
    });
  });
}
