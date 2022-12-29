import {Sheep} from './actors/sheep';

export function toggleCharacterListVisibility(characterList: Sheep[]): void {
  const modalElement = document.getElementById('character-list-modal');
  if (modalElement) {
    const isOpen = modalElement.style.display === 'block';
    if (!isOpen) {
      const characterListElement = document.getElementById('character-list');
      if (characterListElement) {
        const list = characterList
          .map(
            (sheep) =>
              `<div class="sheep"><img class="sheep-head" src="./images/gooblin-head.svg" /><span>${sheep.x}, ${sheep.y}</span></div>`,
          )
          .reduce((prev, current) => prev + current, '');
        characterListElement.innerHTML = list;
      }
    }
    modalElement.style.display = isOpen ? 'none' : 'block';
  }
}
