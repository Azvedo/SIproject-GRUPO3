// lib/algorithms/bfs.ts
import { Grid, Position, SearchHistoryFrame } from '../types';
import { getNeighbors, reconstructPath } from '../utils';

export function bfsSearch(
  grid: Grid,
  startPos: Position,
  endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
  // Inicialização
  const startNode = grid[startPos.y][startPos.x];
  const endNode = grid[endPos.y][endPos.x];
  const history: SearchHistoryFrame[] = [];

  const queue: typeof startNode[] = [];
  const visited = new Set<string>(); // "y-x"

  // Reseta os custos e pais dos nós do grid
  grid.forEach(row => row.forEach(node => {
    node.gCost = Infinity;
    node.parent = null;
  }));

  startNode.gCost = 0;
  queue.push(startNode);
  visited.add(`${startNode.y}-${startNode.x}`);

  while (queue.length > 0) {
    const currentNode = queue.shift()!;

    // Grava o estado atual para a animação
    history.push({
      visited: Array.from(visited).map(s => ({
        y: parseInt(s.split('-')[0]),
        x: parseInt(s.split('-')[1])
      })),
      frontier: queue.map(n => ({ x: n.x, y: n.y }))
    });

    if (currentNode === endNode) {
      return { path: reconstructPath(endNode), history, cost: endNode.gCost };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      const key = `${neighbor.y}-${neighbor.x}`;
      if (!visited.has(key)) {
        visited.add(key);
        neighbor.parent = currentNode;
        neighbor.gCost = currentNode.gCost + neighbor.cost; // Para BFS, normalmente custo é 1, mas mantive o custo do terreno
        queue.push(neighbor);
      }
    }
  }

  // Caminho não encontrado
  return { path: [], history, cost: -1 };
}
