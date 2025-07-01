import { Grid, Node, Position, SearchHistoryFrame, Terrain } from '../types';
import { manhattanDistance } from '../heuristics';
import { PriorityQueue } from '../priorityQueue';
import { getNeighbors, reconstructPath } from '../utils';

export function greedySearch(
  grid: Grid,
  startPos: Position,
  endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
  // Inicialização
  const startNode = grid[startPos.y][startPos.x];
  const endNode = grid[endPos.y][endPos.x];
  const history: SearchHistoryFrame[] = [];
  
  // Busca Gulosa usa uma Fila de Prioridade ordenada apenas por hCost (heurística).
  const frontier = new PriorityQueue('hCost');
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
  startNode.fCost = startNode.hCost; // Na busca gulosa, fCost é apenas a heurística
  
  frontier.enqueue(startNode);

  while (!frontier.isEmpty()) {
    const currentNode = frontier.dequeue()!;

    // Pulando nós já visitados
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

      //Mesmo calculando apenas a heurística, precisamos manter o gCost atualizado para o custo total
      const tentativeGCost = currentNode.gCost + neighbor.cost;

      // Se encontramos um caminho melhor para este vizinho
      if (tentativeGCost < neighbor.gCost) {
        neighbor.parent = currentNode;
        neighbor.gCost = tentativeGCost;
        neighbor.hCost = manhattanDistance(neighbor, endNode);
        neighbor.fCost = neighbor.hCost; // Busca gulosa usa apenas a heurística
        
        frontier.enqueue(neighbor);
      }
    }
  }

  // Caminho não encontrado
  return { path: [], history, cost: -1 };
}