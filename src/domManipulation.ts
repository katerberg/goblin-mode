export function setTextOnId(id: string, value: string): void {
  const activeNode = document.getElementById(id);
  if (activeNode) {
    activeNode.innerHTML = value;
  }
}
