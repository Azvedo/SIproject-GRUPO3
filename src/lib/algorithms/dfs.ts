import { Grid, Node, Position, SearchHistoryFrame } from '../types';
import { getNeighbors, reconstructPath } from '../utils';

export function dfsSearch(
    grid: Grid,
    startPos: Position,
    endPos: Position
): { path: Position[]; history: SearchHistoryFrame[]; cost?: number } {
    const startNode = grid[startPos.y][startPos.x];
    const endNode = grid[endPos.y][endPos.x];
    const history: SearchHistoryFrame[] = [];
    const stack: Node[] = [];
    const visited = new Set<string>(); // "y-x"

    // Reset node states
    grid.forEach(row => row.forEach(node => {
        node.gCost = Infinity;
        node.parent = null;
    }));

    startNode.gCost = 0;
    stack.push(startNode);

    while (stack.length > 0) {
        const currentNode = stack.pop()!;

        if (visited.has(`${currentNode.y}-${currentNode.x}`)) {
            continue;
        }
        visited.add(`${currentNode.y}-${currentNode.x}`);

        history.push({
            visited: Array.from(visited).map(s => ({ y: parseInt(s.split('-')[0]), x: parseInt(s.split('-')[1]) })),
            frontier: stack.map(n => ({ x: n.x, y: n.y }))
        });

        if (currentNode === endNode) {
            return { path: reconstructPath(endNode), history, cost: endNode.gCost };
        }

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (visited.has(`${neighbor.y}-${neighbor.x}`)) {
                continue;
            }
            
            if (neighbor.gCost === Infinity) {
                neighbor.parent = currentNode;
                neighbor.gCost = currentNode.gCost + neighbor.cost;
                stack.push(neighbor);
            }
        }
    }

    return { path: [], history, cost: -1 };
}