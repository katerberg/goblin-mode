import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';

export class Pause implements SpeedActor, Actor {
  private resolver;

  private speed: number;

  public resolve: () => void;

  constructor() {
    this.speed = 1;
    //eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    this.resolve = () => {};
    this.resolver = new Promise((resolve) => {
      this.resolve = (): void => resolve(null);
    });
  }

  getSpeed(): number {
    return this.speed;
  }

  public async act(): Promise<void> {
    await this.resolver;
  }
}
