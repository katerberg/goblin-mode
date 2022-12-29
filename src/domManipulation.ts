export function toggleCharacterListVisibility(): void {
  const characterList = document.getElementById('character-list');
  if (characterList) {
    characterList.style.display = characterList.style.display === 'none' ? 'block' : 'none';
  }
}
