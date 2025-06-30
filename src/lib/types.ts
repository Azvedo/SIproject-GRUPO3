// lib/types.ts

// Enum para os tipos de terreno. Usar um enum torna o código mais legível
// do que usar strings soltas como "sand" ou "water".
export enum Terrain {
  LowCost = 'sand',
  MediumCost = 'mud',
  HighCost = 'water',
  Obstacle = 'obstacle',
}

// Interface que define a estrutura de uma única célula (ou Nó) no nosso grid.
// Cada célula tem uma posição, um tipo de terreno e várias propriedades
// usadas pelos algoritmos de busca.
export interface Node {
  x: number;
  y: number;
  terrain: Terrain;
  cost: number; // Custo para atravessar esta célula (1, 5, 10 ou Infinito)

  // Propriedades para os algoritmos de busca
  gCost: number; // Custo acumulado do início até este nó
  hCost: number; // Custo heurístico (distância estimada até o fim)
  fCost: number; // Custo total (gCost + hCost), usado pelo A*
  parent: Node | null; // Referência ao nó anterior para reconstruir o caminho
}

// Tipo para representar o grid completo: uma matriz 2D de Nós.
export type Grid = Node[][];

// Tipo para representar uma posição simples no grid.
export interface Position {
  x: number;
  y: number;
}

// Tipo que define a "história" da busca. Para cada passo da animação,
// guardamos quais nós estão na fronteira e quais já foram visitados.
export interface SearchHistoryFrame {
  frontier: Position[];
  visited: Position[];
}

// Tipo para os algoritmos de busca que o usuário pode escolher.
export type SearchAlgorithm = 'BFS' | 'DFS' | 'UCS' | 'Greedy' | 'A*';