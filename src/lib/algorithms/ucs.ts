import { Grid, Position, SearchHistoryFrame } from '../types';
import { PriorityQueue } from '../priorityQueue';
import { getNeighbors, reconstructPath } from '../utils';

export function ucsSearch(
  grid: Grid,
  startPos: Position,
  endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
  const startNode = grid[startPos.y][startPos.x];
  const endNode = grid[endPos.y][endPos.x];
  const history: SearchHistoryFrame[] = [];

  const frontier = new PriorityQueue('gCost');
  const visited = new Set<string>(); // "y-x"

  grid.forEach((row) =>
    row.forEach((node) => {
      node.gCost = Infinity;
      node.hCost = 0; 
      node.fCost = Infinity;
      node.parent = null;
    })
  );

  startNode.gCost = 0;
  startNode.fCost = 0; 

  frontier.enqueue(startNode);

  while (!frontier.isEmpty()) {
    const currentNode = frontier.dequeue()!;

    if (visited.has(`${currentNode.y}-${currentNode.x}`)) {
      continue;
    }
    visited.add(`${currentNode.y}-${currentNode.x}`);

    history.push({
      visited: Array.from(visited).map((s) => ({
        y: parseInt(s.split('-')[0]),
        x: parseInt(s.split('-')[1])
      })),
      frontier: frontier.getValues().map((n) => ({ x: n.x, y: n.y }))
    });

    if (currentNode === endNode) {
      return { path: reconstructPath(endNode), history, cost: endNode.gCost };
    }

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (visited.has(`${neighbor.y}-${neighbor.x}`)) {
        continue;
      }

      const tentativeGCost = currentNode.gCost + neighbor.cost;

      if (tentativeGCost < neighbor.gCost) {
        neighbor.parent = currentNode;
        neighbor.gCost = tentativeGCost;
        neighbor.fCost = tentativeGCost;

        frontier.enqueue(neighbor);
      }
    }
  }

  return { path: [], history, cost: -1 };
}
