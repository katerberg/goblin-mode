export enum Perk {
  SPEED,
  RANGE,
  DAMAGE,
  ARMOR,
}

export type Perks = {[Perk.SPEED]: number; [Perk.RANGE]: number; [Perk.DAMAGE]: number; [Perk.ARMOR]: number};
