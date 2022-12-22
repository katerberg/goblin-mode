import {Tile} from './tile';

export class Game {
  public tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = [];
    for (let w = 0; w < width; w++) {
      this.tiles[w] = [];
      for (let h = 0; h < height; h++) {
        // x position is divided by two to get display position
        // y position is accurate
        if (h % 2 && w % 2) {
          this.tiles[w][h] = new Tile(w, h);
        }
        if (h % 2 === 0 && w % 2 === 0) {
          this.tiles[w][h] = new Tile(w, h);
        }
      }
    }
  }
}
