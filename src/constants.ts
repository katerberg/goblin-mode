export const symbols = {
  ENEMY: '?',
  PEASANT: 'ψ',
  GUARD: '⚔',
  JUDGE: '⚖',
  ARCHER: '⤑',
  FLAG: '⚑',
  GATE: '∩',
  SHEEP: '웃',
  SPACE_WALL: '█',
  SPACE_OPEN: ' ',
};

export const board = {
  width: 30,
  height: 30,
};

export const topOffset = 3;
export const maxLevel = 6;

export const times = {
  TURN_DELAY: 200,
  TURN_DELAY_TUNNEL: 100,
};

export const colors = {
  BACKGROUND_GATE: '#FF9900',
  BACKGROUND_VISIBLE_PASSABLE: '#dfdfdf',
  BACKGROUND_VISIBLE_IMPASSABLE: '#4D4D4D',
  BACKGROUND_NONVISIBLE_PASSABLE: '#8C8C8C',
  BACKGROUND_NONVISIBLE_IMPASSABLE: '#4D4D4D',
  BACKGROUND_UNDISCOVERED: '#4D4D4D',
  DEMON_FIRE_1: '#973716',
  DEMON_FIRE_2: '#cd4606',
  DEMON_FIRE_3: '#ec760c',
  DEMON_FIRE_4: '#ffae34',
  DEMON_FIRE_5: '#feec85',
  FLAG: '#FA4ED6',
  HURT: '#FF0000',
  GATE: '#663399',
};

export enum Status {
  ACTIVE,
  DEAD,
  QUEUED,
  SAFE,
}

export const levelLimits = [0, 2, 5, 11, 21, 30, 45, 70, 105];
