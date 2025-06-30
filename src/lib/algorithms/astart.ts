// lib/algorithms/astar.ts
import { Grid, Node, Position, SearchHistoryFrame, Terrain } from '../types';
import { manhattanDistance } from '../heuristics';
import { PriorityQueue } from '../priorityQueue';
import { getNeighbors, reconstructPath } from '../utils';

export function aStarSearch(
  grid: Grid,
  startPos: Position,
  endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
  // Inicialização
  const startNode = grid[startPos.y][startPos.x];
  const endNode = grid[endPos.y][endPos.x];
  const history: SearchHistoryFrame[] = [];
  
  // A* usa uma Fila de Prioridade ordenada por fCost (gCost + hCost).
  const frontier = new PriorityQueue('fCost');
  const visited = new Set<string>(); // "y-x"

  // Reseta os custos dos nós do grid para garantir buscas limpas
  grid.forEach(row => row.forEach(node => {
      node.gCost = Infinity;
      node.hCost = Infinity;
      node.fCost = Infinity;
      node.parent = null;
  }));

  startNode.gCost = 0;
  startNode.hCost = manhattanDistance(startNode, endNode);
  startNode.fCost = startNode.gCost + startNode.hCost;
  
  frontier.enqueue(startNode);

  while (!frontier.isEmpty()) {
    const currentNode = frontier.dequeue()!;

    // Se já visitamos um nó com um caminho melhor, pulamos este.
    if (visited.has(`${currentNode.y}-${currentNode.x}`)) {
      continue;
    }
    visited.add(`${currentNode.y}-${currentNode.x}`);

    // Grava o estado atual para a animação
    history.push({
        visited: Array.from(visited).map(s => ({y: parseInt(s.split('-')[0]), x: parseInt(s.split('-')[1])})),
        frontier: frontier.getValues().map(n => ({x: n.x, y: n.y}))
    });

    // Objetivo alcançado
    if (currentNode === endNode) {
      return { path: reconstructPath(endNode), history, cost: endNode.gCost };
    }

    // Explora os vizinhos
    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (visited.has(`${neighbor.y}-${neighbor.x}`)) {
        continue;
      }

      // O custo para chegar ao vizinho é o custo para chegar ao nó atual mais o custo do terreno do vizinho.
      const tentativeGCost = currentNode.gCost + neighbor.cost;

      if (tentativeGCost < neighbor.gCost) {
        neighbor.parent = currentNode;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = manhattanDistance(neighbor, endNode);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;
        
        frontier.enqueue(neighbor);
      }
    }
  }

  // Caminho não encontrado
  return { path: [], history, cost: -1 };
}