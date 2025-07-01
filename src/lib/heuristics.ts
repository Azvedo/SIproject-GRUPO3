import { Node } from './types';

/**
 * Calcula a distância de Manhattan entre dois nós.
 * É a soma das diferenças absolutas de suas coordenadas.
 * Ótima para grids onde o movimento é restrito a 4 direções (cima, baixo, esquerda, direita).
 * $d = |x_1 - x_2| + |y_1 - y_2|$
 */
export function manhattanDistance(nodeA: Node, nodeB: Node): number {
  const dx = Math.abs(nodeA.x - nodeB.x);
  const dy = Math.abs(nodeA.y - nodeB.y);
  return dx + dy;
}

/**
 * Calcula a distância Euclidiana entre dois nós.
 * É a distância em linha reta (a hipotenusa).
 * Útil para grids onde o movimento é permitido em 8 direções (incluindo diagonais).
 * $d = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$
 */
export function euclideanDistance(nodeA: Node, nodeB: Node): number {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  return Math.sqrt(dx * dx + dy * dy);
}