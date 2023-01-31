import {SpeedActor} from 'rot-js';
import {Status, symbols} from '../constants';
import {Actor} from '../definitions/actor';
import {Perk, Perks} from '../definitions/perks';
import {Position} from '../definitions/position';
import {Game} from '../game';
import {GameMap} from '../gameMap';
import {isWithin} from '../mapUtils';
import {getGoblinName, getRandomGreen} from '../utils';
import {Character} from './character';
import {Enemy} from './enemy';

const getEmptyPerks = (): Perks => ({[Perk.RANGE]: 0, [Perk.SPEED]: 0, [Perk.DAMAGE]: 0, [Perk.ARMOR]: 0});

function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = enumValues[randomIndex];
  return randomEnumValue;
}

const getRandomPerk = (): [perk: Perk, value: number] => {
  const newPerk = randomEnum(Perk);
  return [newPerk, newPerk === Perk.SPEED ? 100 : 1];
};

export class Sheep extends Character implements SpeedActor, Actor {
  private baseSpeed: number;

  private map: GameMap;

  private baseVisibility: number;

  public name: string;

  private xp: number;

  public level: number;

  perkQueue: [Perk, number][];

  perks: Perks;

  color: string;

  status: Status;

  constructor(x: number, y: number, game: Game, map: GameMap) {
    super({x, y}, game);
    this.status = Status.QUEUED;
    this.xp = 0;
    this.level = 1;
    this.name = getGoblinName();
    this.color = getRandomGreen();
    this.baseVisibility = 8;
    this.baseSpeed = 100;
    this.map = map;
    this.perks = getEmptyPerks();
    this.perkQueue = Array.from(Array(30)).map(() => getRandomPerk());
  }

  public get range(): number {
    return this.baseRange + this.perks[Perk.RANGE];
  }

  public get attack(): number {
    return this.baseAttack + this.perks[Perk.DAMAGE];
  }

  public get armor(): number {
    return this.baseArmor + this.perks[Perk.ARMOR];
  }

  setGoal(x: number, y: number): void {
    this.goal = `${x},${y}`;
  }

  public get position(): Position {
    return {x: this.x, y: this.y};
  }

  public get visibility(): number {
    return this.baseVisibility;
  }

  private getClosestEnemyWithinRange(): Enemy | undefined {
    let closestEnemy: Enemy | undefined;
    for (let i = 1; i <= this.visibility; i++) {
      for (const enemyPosition of this.game.getEnemyPositions()) {
        if (isWithin(this.position, enemyPosition, i)) {
          closestEnemy = this.game.getEnemyAt(enemyPosition);
          break;
        }
      }
      if (closestEnemy) {
        break;
      }
    }
    return closestEnemy;
  }

  // (level/0.3)^2
  //1: 11
  //2: 44
  //3: 100
  //4: 177
  //5: 277
  private gainXp(xp: number): void {
    this.xp += xp;
    const newLevel = Math.ceil(Math.sqrt(xp) * 0.3) + 1;
    if (newLevel !== this.level) {
      this.levelUp(newLevel);
    }
  }

  private levelUp(level: number): void {
    this.baseHp = level * level;
    this.sufferedDamage = 0;
    this.level = level;
  }

  public perkUp(upgrade: Perk, value: number): void {
    this.perks[upgrade] += value;
  }

  public async act(): Promise<void> {
    const enemy = this.getClosestEnemyWithinRange();
    if (enemy) {
      if (isWithin(this.position, enemy, this.range)) {
        enemy.takeDamage(this.attack);
        this.gainXp(this.attack * 20);
        return;
      }
    }

    const {path} = this;
    const canMove = path[0] && !this.game.isOccupiedTile(path[0][0], path[0][1]);
    if (canMove) {
      const [[nextX, nextY]] = path;

      this.x = nextX;
      this.y = nextY;
    }

    this.game.drawFov();

    if (canMove) {
      const endGate = this.map.getEndGate();
      if (this.x === endGate.x && this.y === endGate.y) {
        this.game.handleSheepAtGate(this);
      }
    }
  }

  isHidden(): boolean {
    const startGate = this.map.getStartGate();
    return isWithin(this.position, {x: startGate.x, y: startGate.y}, 0);
  }

  getSpeed(): number {
    return this.baseSpeed + this.perks[Perk.SPEED];
  }

  draw(bgColor: string): void {
    globalThis.display.draw(this.x, this.y, symbols.SHEEP, this.color, bgColor);
  }
}
