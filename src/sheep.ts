import {SpeedActor} from 'rot-js';
import {Actor} from './interfaces/actor';

export class Sheep implements SpeedActor, Actor {
  public x: number;

  public y: number;

  private speed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.speed = 1;
  }

  public async act(): Promise<void> {
    //eslint-disable-next-line no-console
    await console.log(`${this.speed}acting`);
  }

  getSpeed(): number {
    return this.speed;
  }

  draw(bgColor: string): void {
    globalThis.display.draw(this.x, this.y, '웃', null, bgColor);
  }
}
