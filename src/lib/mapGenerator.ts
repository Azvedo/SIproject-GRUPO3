// lib/mapGenerator.ts

import { Grid, Node, Position, Terrain } from './types';

// Mapeia os tipos de terreno para seus custos correspondentes.
const terrainCosts: { [key in Terrain]: number } = {
  [Terrain.LowCost]: 1,
  [Terrain.MediumCost]: 5,
  [Terrain.HighCost]: 10,
  [Terrain.Obstacle]: Infinity,
};

/**
 * Gera um grid aleatório com diferentes tipos de terreno.
 * @param width - Largura do grid.
 * @param height - Altura do grid.
 * @returns Um novo grid gerado aleatoriamente.
 */
export function generateRandomMap(width: number, height: number): Grid {
  const grid: Grid = [];
  for (let y = 0; y < height; y++) {
    const row: Node[] = [];
    for (let x = 0; x < width; x++) {
      const randomValue = Math.random();
      let terrain: Terrain;

      // Define o tipo de terreno com base em probabilidades.
      // 15% de chance de ser obstáculo.
      if (randomValue < 0.15) {
        terrain = Terrain.Obstacle;
      }
      // 20% de chance de ser água.
      else if (randomValue < 0.35) {
        terrain = Terrain.HighCost;
      }
      // 25% de chance de ser atoleiro.
      else if (randomValue < 0.6) {
        terrain = Terrain.MediumCost;
      }
      // 40% de chance de ser areia.
      else {
        terrain = Terrain.LowCost;
      }
      
      row.push({
        x,
        y,
        terrain,
        cost: terrainCosts[terrain],
        gCost: Infinity, // Inicializa custos como infinito
        hCost: Infinity,
        fCost: Infinity,
        parent: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Encontra uma posição aleatória no grid que não seja um obstáculo.
 * Útil para posicionar o agente e a comida.
 * @param grid - O grid para procurar uma posição.
 * @returns Uma posição {x, y} válida.
 */
export function getRandomValidPosition(grid: Grid): Position {
  const width = grid[0].length;
  const height = grid.length;
  let x: number, y: number;

  do {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  } while (grid[y][x].terrain === Terrain.Obstacle); // Continua tentando até achar uma célula não-obstáculo

  return { x, y };
}