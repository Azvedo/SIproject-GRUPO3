// app/components/Grid.tsx
'use client';

import { Grid as GridType, Node, Position, Terrain } from '@/lib/types';

interface GridProps {
  grid: GridType;
  agentPos: Position;
  foodPos: Position;
  visitedNodes: Set<string>;
  frontierNodes: Set<string>;
  pathNodes: Set<string>;
}

// Mapeamento para evitar um switch/case dentro do componente
const terrainToClassMap: { [key in Terrain]: string } = {
  [Terrain.LowCost]: 'bg-[var(--color-sand)]',
  [Terrain.MediumCost]: 'bg-[var(--color-mud)]',
  [Terrain.HighCost]: 'bg-[var(--color-water)]',
  [Terrain.Obstacle]: 'bg-[var(--color-obstacle)]',
};

export default function Grid({
  grid,
  agentPos,
  foodPos,
  visitedNodes,
  frontierNodes,
  pathNodes,
}: GridProps) {

  // Esta função agora retorna APENAS as classes da célula base (terreno, tamanho, etc.)
  const getCellClasses = (node: Node) => {
    const terrainClass = terrainToClassMap[node.terrain];
    return `w-5 h-5 border border-black/10 relative ${terrainClass}`;
  };

  // Esta NOVA função retorna APENAS a classe do overlay (caminho, visitado, etc.)
  const getOverlayClass = (node: Node) => {
    const posKey = `${node.y}-${node.x}`;
    
    // A ordem de prioridade garante que o caminho seja a cor mais importante
    if (pathNodes.has(posKey)) return 'bg-[var(--color-path)]';
    if (frontierNodes.has(posKey)) return 'bg-[var(--color-frontier)]';
    if (visitedNodes.has(posKey)) return 'bg-[var(--color-visited)]';

    return ''; // Retorna uma string vazia se não houver overlay
  };

  if (!grid.length) return <div>Carregando mapa...</div>;

  return (
    <div
      className="inline-grid"
      style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
    >
      {grid.map((row) =>
        row.map((node) => (
          <div key={`${node.y}-${node.x}`} className={getCellClasses(node)}>
            <div className={`absolute inset-0 ${getOverlayClass(node)}`} />

            {/* O agente e a comida agora ficam por cima de ambas as camadas */}
            {agentPos.x === node.x && agentPos.y === node.y && (
              <div className="absolute inset-0 bg-[var(--color-agent)] rounded-full animate-pulse" />
            )}
            {foodPos.x === node.x && foodPos.y === node.y && (
              <div className="absolute inset-0 flex items-center justify-center text-lg z-10">
                ⭐
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}