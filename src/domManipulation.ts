import {Sheep} from './actors/sheep';

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

export function toggleCharacterListVisibility(characterList: Sheep[]): void {
  const modalElement = document.getElementById('character-list-modal');
  if (!modalElement) {
    return;
  }
  const isOpen = modalElement.style.display === 'block';
  if (!isOpen) {
    const characterListElement = document.getElementById('character-list');
    if (characterListElement) {
      const list = characterList
        .map(
          (sheep) =>
            `<div class="sheep"><img class="sheep-head" src="./images/gooblin-head.svg" /><span>${sheep.name} - ${sheep.x}, ${sheep.y} - Level ${sheep.level}</span></div>`,
        )
        .reduce((prev, current) => prev + current, '');
      characterListElement.innerHTML = list;
    }
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
