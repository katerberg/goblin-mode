export interface Actor {
  act: (time: number) => Promise<boolean>;
}
