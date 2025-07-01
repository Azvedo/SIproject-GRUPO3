import { Node } from './types';


export function manhattanDistance(nodeA: Node, nodeB: Node): number {
  const dx = Math.abs(nodeA.x - nodeB.x);
  const dy = Math.abs(nodeA.y - nodeB.y);
  return dx + dy;
}


export function euclideanDistance(nodeA: Node, nodeB: Node): number {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  return Math.sqrt(dx * dx + dy * dy);
}