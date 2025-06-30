import { Grid, Node, Position, Terrain } from './types';

// Função auxiliar para obter os vizinhos válidos de um nó.
export function getNeighbors(node: Node, grid: Grid): Node[] {
  const neighbors: Node[] = [];
  const { x, y } = node;
  const directions = [
    { dx: 0, dy: -1 }, // Cima
    { dx: 0, dy: 1 },  // Baixo
    { dx: -1, dy: 0 }, // Esquerda
    { dx: 1, dy: 0 },  // Direita
  ];

  for (const dir of directions) {
    const newX = x + dir.dx;
    const newY = y + dir.dy;

    if (
      newY >= 0 && newY < grid.length &&
      newX >= 0 && newX < grid[0].length &&
      grid[newY][newX].terrain !== Terrain.Obstacle
    ) {
      neighbors.push(grid[newY][newX]);
    }
  }
  return neighbors;
}

// Função para reconstruir o caminho final, seguindo os ponteiros "parent"
// a partir do nó final até o inicial.
export function reconstructPath(endNode: Node): Position[] {
  const path: Position[] = [];
  let currentNode: Node | null = endNode;
  while (currentNode) {
    path.unshift({ x: currentNode.x, y: currentNode.y });
    currentNode = currentNode.parent;
  }
  return path;
}