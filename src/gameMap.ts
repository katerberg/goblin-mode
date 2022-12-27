import {Map} from 'rot-js';
import {Position} from './interfaces/position';
import {Tile} from './tile';

export class GameMap {
  private startGatePosition: Position;

  private endGatePosition: Position;

  private tiles: Tile[][];

  constructor(width: number, height: number) {
    this.tiles = [];
    const map = new Map.Uniform(width + 2, height + 2, {roomDugPercentage: 1});
    const mapCallback = (x: number, y: number, contents: number): void => {
      if (x === 0 || x === width + 1 || y === 0 || y === height + 1) {
        return;
      }
      const tileX = x - 1;
      const tileY = y - 1;
      if (!this.tiles[tileX]) {
        this.tiles[tileX] = [];
      }
      this.tiles[tileX][tileY] = new Tile(tileX, tileY, contents === 0);
    };
    map.create(mapCallback.bind(this));
    const startTile = this.getRandomTile(this.tiles[0].length - 1, false);
    this.startGatePosition = {
      x: startTile.x,
      y: startTile.y,
    };
    const endTile = this.getRandomTile(0, true);
    this.endGatePosition = {
      x: endTile.x,
      y: endTile.y,
    };
  }

  getStartGate(): Tile {
    return this.tiles[this.startGatePosition.x][this.startGatePosition.y];
  }

  getEndGate(): Tile {
    return this.tiles[this.endGatePosition.x][this.endGatePosition.y];
  }

  matchesGate(x: number, y: number): boolean {
    return (
      (this.startGatePosition.x === x && this.startGatePosition.y === y) ||
      (this.endGatePosition.x === x && this.endGatePosition.y === y)
    );
  }

  drawTiles(): void {
    this.tiles.forEach((tileRow) => tileRow.forEach((tile) => tile.draw()));
  }

  getTileColor(x: number, y: number): string {
    return this.getTile(x, y)?.backgroundColor || '#fff';
  }

  isPassableTile(x: number, y: number): boolean {
    return !!this.getTile(x, y)?.isPassable;
  }

  private getTile(x: number, y: number): Tile | undefined {
    return this.tiles?.[x]?.[y];
  }

  private getRandomTile(startRow: number, increasing: boolean): Tile {
    let tile: Tile | undefined = undefined;
    for (let rowNumber = startRow; !tile; rowNumber += increasing ? 1 : -1) {
      const filteredColumns = this.tiles.filter((column) => column[rowNumber].isPassable);
      if (filteredColumns.length) {
        tile = filteredColumns[Math.floor(Math.random() * filteredColumns.length)][rowNumber];
      }
    }
    return tile;
  }
}