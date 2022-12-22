import {Tile} from './tile';

export class Game {
  public tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = [];
    for (let w = 0; w < width; w++) {
      this.tiles[w] = [];
      for (let h = 0; h < height; h++) {
        this.tiles[w][h] = new Tile(w, h);
      }
    }
  }
}
