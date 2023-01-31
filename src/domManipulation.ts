import {Sheep} from './actors/sheep';
import {getPerkName, Perk} from './definitions/perks';

function removeDemonWarning(): void {
  const warningElement = document.getElementById('warning-message');
  if (!warningElement) {
    return;
  }

  warningElement.classList.replace('fade-in-animation', 'fade-out-animation');
}

export function triggerDemonWarning(): void {
  const warningElement = document.getElementById('warning-message');
  if (!warningElement) {
    return;
  }

  warningElement.classList.remove('fade-out-animation');
  warningElement.classList.add('fade-in-animation');
  setTimeout(removeDemonWarning, 2500);
}

function hpBar(sheep: Sheep): string {
  return `<span class="health-bar"><span class="current-health" style="width: ${
    (100 * sheep.hp) / sheep.baseHp
  }%" /></span>`;
}

function perkButton(perk: [perkName: Perk, value: number], sheep: Sheep): string {
  return `<button class="perk-button" data-sheep-name="${sheep.name}" data-perk-value="${perk[1]}">${getPerkName(
    perk[0],
  )}</button>`;
}

function perkOptions(sheep: Sheep): string {
  return `<span class="perk-buttons">${perkButton(sheep.perkQueue[0], sheep)}${perkButton(
    sheep.perkQueue[1],
    sheep,
  )}</span>`;
}

function drawCharacterListModal(characterList: Sheep[]): void {
  const characterListElement = document.getElementById('character-list');
  if (characterListElement) {
    const list = characterList
      .map(
        (sheep) =>
          `<div class="sheep"><img class="sheep-head" src="./images/gooblin-head.svg" /><span class="details"><span class="description"><span class="name">${
            sheep.name
          } </span><span class="level">- ${sheep.level} </span></span>${
            sheep.needsPerk() ? perkOptions(sheep) : hpBar(sheep)
          }</span></div>`,
      )
      .reduce((prev, current) => prev + current, '');
    characterListElement.innerHTML = list;
    const elements = document.getElementsByClassName('perk-button');
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('touchstart', (e) => {
        const name = elements[i].getAttribute('data-sheep-name');
        const sheep = characterList.find((c) => c.name === name);
        sheep?.perkUp(
          Perk[((e.target as HTMLElement).textContent || 'Speed').toUpperCase() as keyof typeof Perk],
          parseInt(elements[i].getAttribute('data-perk-value') || '0', 10),
        );
        drawCharacterListModal(characterList);
      });
    }
  }
}

export function toggleCharacterListVisibility(characterList: Sheep[]): void {
  const modalElement = document.getElementById('character-list-modal');
  if (!modalElement) {
    return;
  }
  const isOpen = modalElement.style.display === 'block';
  if (!isOpen) {
    drawCharacterListModal(characterList);
  }
  modalElement.style.display = isOpen ? 'none' : 'block';
}

export function setLevel(level: number): void {
  const levelElement = document.getElementById('level-title');
  if (!levelElement) {
    return;
  }

  levelElement.innerHTML = `Level ${level}`;
}
