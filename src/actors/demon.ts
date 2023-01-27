import {SpeedActor} from 'rot-js';
import {Actor} from '../definitions/actor';
import {triggerDemonWarning} from '../domManipulation';

export class Demon implements SpeedActor, Actor {
  private speed;

  private hasWarned;

  public burningSpaces;

  private timeToCome;

  constructor() {
    this.timeToCome = 0.2;
    this.burningSpaces = 0;
    this.speed = 10;
    this.hasWarned = false;
  }

  getSpeed(): number {
    return this.speed;
  }

  nextLevel(time: number): void {
    this.burningSpaces = 0;
    this.hasWarned = false;
    this.timeToCome += time;
  }

  async act(time: number): Promise<void> {
    if (time < this.timeToCome) {
      return;
    }
    if (!this.hasWarned) {
      await triggerDemonWarning();
      this.hasWarned = true;
    } else {
      this.burningSpaces++;
    }
  }
}
