import {Tile} from './tile';

type Position = {x: number; y: number};

export class Game {
  private startGatePosition: Position;

  private endGatePosition: Position;

  public tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = [];
    for (let w = 0; w < width; w++) {
      this.tiles[w] = [];
      for (let h = 0; h < height; h++) {
        this.tiles[w][h] = new Tile(w, h);
      }
    }
    this.startGatePosition = {
      x: this.getRandomXCoordinate(),
      y: this.tiles.length - 1,
    };
    this.endGatePosition = {
      x: this.getRandomXCoordinate(),
      y: 0,
    };

    this.getStartGate().setBackgroundColor('tomato');
    this.getEndGate().setBackgroundColor('rebeccapurple');
  }

  private getRandomXCoordinate(): number {
    return Math.floor(Math.random() * (this.tiles[this.tiles.length - 1].length - 1));
  }

  getStartGate(): Tile {
    return this.tiles[this.startGatePosition.x][this.startGatePosition.y];
  }

  getEndGate(): Tile {
    return this.tiles[this.endGatePosition.x][this.endGatePosition.y];
  }
}
