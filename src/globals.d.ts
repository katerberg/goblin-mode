/*eslint-disable no-var*/
import * as ROT from 'rot-js';

declare global {
  var display: ROT.Display;

  var gameElement: HTMLElement;

  var width: number;
  var height: number;

  var goblinNames: string[];
}
