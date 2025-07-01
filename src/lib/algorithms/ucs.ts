// lib/algorithms/ucs.ts
import { Grid, Position, SearchHistoryFrame } from '../types';
import { PriorityQueue } from '../priorityQueue';
import { getNeighbors, reconstructPath } from '../utils';

export function ucsSearch(
  grid: Grid,
  startPos: Position,
  endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
  // Inicialização
  const startNode = grid[startPos.y][startPos.x];
  const endNode = grid[endPos.y][endPos.x];
  const history: SearchHistoryFrame[] = [];

  // UCS usa uma Fila de Prioridade ordenada por gCost (custo do caminho).
  const frontier = new PriorityQueue('gCost');
  const visited = new Set<string>(); // "y-x"

  // Reseta os custos dos nós do grid para garantir buscas limpas
  grid.forEach((row) =>
    row.forEach((node) => {
      node.gCost = Infinity;
      node.hCost = 0; // Não usado pela UCS, mas zeramos por consistência
      node.fCost = Infinity;
      node.parent = null;
    })
  );

  startNode.gCost = 0;
  startNode.fCost = 0; // fCost em UCS é apenas gCost

  frontier.enqueue(startNode);

  while (!frontier.isEmpty()) {
    const currentNode = frontier.dequeue()!;

    // Se já visitamos um nó, pulamos.
    // Em UCS, como a fila de prioridade garante que sempre pegamos o caminho de menor custo,
    // o primeiro a visitar um nó é o que tem o menor custo.
    if (visited.has(`${currentNode.y}-${currentNode.x}`)) {
      continue;
    }
    visited.add(`${currentNode.y}-${currentNode.x}`);

    // Grava o estado atual para a animação
    history.push({
      visited: Array.from(visited).map((s) => ({
        y: parseInt(s.split('-')[0]),
        x: parseInt(s.split('-')[1])
      })),
      frontier: frontier.getValues().map((n) => ({ x: n.x, y: n.y }))
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

      // Se encontramos um caminho mais barato para o vizinho...
      if (tentativeGCost < neighbor.gCost) {
        neighbor.parent = currentNode;
        neighbor.gCost = tentativeGCost;
        // fCost é o mesmo que gCost para a ordenação na fila de prioridade
        // (A classe PriorityQueue precisa de uma chave, mas para UCS o valor é o próprio gCost)
        neighbor.fCost = tentativeGCost;

        frontier.enqueue(neighbor);
      }
    }
  }

  // Caminho não encontrado
  return { path: [], history, cost: -1 };
}
