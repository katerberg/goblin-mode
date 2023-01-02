import {Map} from 'rot-js';
import {colors, topOffset} from './constants';
import {Position} from './definitions/position';
import {Tile} from './tile';

export class GameMap {
  private startGatePosition: Position;

  private endGatePosition: Position;

  private tiles: Tile[][];

  private seenTiles: {[key: `${number},${number}`]: Tile};

  constructor(width: number, height: number) {
    this.tiles = [];
    this.seenTiles = {};
    const map = new Map.Cellular(width, height);
    const mapCallback = (x: number, y: number, contents: number): void => {
      const tileX = x;
      const tileY = y + topOffset;
      if (!this.tiles[tileX]) {
        this.tiles[tileX] = [];
      }
      this.tiles[tileX][tileY] = new Tile(tileX, tileY, contents === 1);
    };
    map.randomize(0.55);
    Array.from(Array(5).keys()).forEach(() => {
      map.create(mapCallback.bind(this));
    });
    map.connect(mapCallback.bind(this), 1);
    const startTile = this.getRandomTile(this.tiles[topOffset].length - 1, false);
    this.startGatePosition = {
      x: startTile.x,
      y: startTile.y,
    };
    const endTile = this.getRandomTile(topOffset, true);
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
    this.tiles.forEach((tileRow) =>
      tileRow.forEach((tile) => {
        if (this.seenTiles[`${tile.x},${tile.y}`]) {
          tile.draw();
        }
      }),
    );
  }

  getTileColor(x: number, y: number): string {
    return this.getTile(x, y)?.backgroundColor || '#fff';
  }

  isSeenTile(x: number, y: number): boolean {
    return !!this.seenTiles[`${x},${y}`];
  }

  isNonWallTile(x: number, y: number): boolean {
    return !!this.getTile(x, y)?.isPassable;
  }

  seeTile(position: `${number},${number}`): void {
    if (this.seenTiles[position] !== undefined) {
      return;
    }

    const [x, y] = position.split(',');
    this.seenTiles[position] = this.tiles[x as unknown as number]?.[y as unknown as number] || null;
    if (this.seenTiles[position]) {
      this.seenTiles[position].setBackgroundColor(
        this.seenTiles[position].isPassable ? colors.BACKGROUND_VISIBLE_PASSABLE : colors.BACKGROUND_VISIBLE_IMPASSABLE,
      );
    }
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
