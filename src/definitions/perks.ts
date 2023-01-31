export enum Perk {
  SPEED,
  RANGE,
  DAMAGE,
  ARMOR,
}

export type Perks = {[Perk.SPEED]: number; [Perk.RANGE]: number; [Perk.DAMAGE]: number; [Perk.ARMOR]: number};

export function getPerkName(perk: Perk): string {
  switch (perk) {
    case Perk.SPEED:
      return 'Speed';
    case Perk.ARMOR:
      return 'Armor';
    case Perk.DAMAGE:
      return 'Damage';
    case Perk.RANGE:
    default:
      return 'Range';
  }
}
