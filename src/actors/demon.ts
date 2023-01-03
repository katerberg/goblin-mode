import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';
import {triggerDemonWarning} from '../domManipulation';

export class Demon implements SpeedActor, Actor {
  private speed;

  private hasWarned;

  public burningSpaces;

  constructor() {
    this.burningSpaces = 0;
    this.speed = 10;
    this.hasWarned = false;
  }

  getSpeed(): number {
    return this.speed;
  }

  async act(): Promise<void> {
    if (!this.hasWarned) {
      await triggerDemonWarning();
      this.hasWarned = true;
    }
    this.burningSpaces++;
  }
}
