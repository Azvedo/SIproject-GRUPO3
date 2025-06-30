// app/components/Grid.tsx
'use client';

import { Grid as GridType, Node, Position } from '@/lib/types';
import { useMemo } from 'react';

interface GridProps {
  grid: GridType;
  agentPos: Position;
  foodPos: Position;
  visitedNodes: Set<string>;
  frontierNodes: Set<string>;
  pathNodes: Set<string>;
}

export default function Grid({
  grid,
  agentPos,
  foodPos,
  visitedNodes,
  frontierNodes,
  pathNodes,
}: GridProps) {
  // A função para obter a cor de uma célula.
  // Ela segue uma ordem de prioridade para a sobreposição de cores.
  const getCellClass = (node: Node) => {
    const posKey = `${node.y}-${node.x}`;
    let overlayColor = '';

    // A ordem é importante: o caminho final deve sobrepor os visitados/fronteira.
    if (visitedNodes.has(posKey)) overlayColor = 'bg-[var(--color-visited)]';
    if (frontierNodes.has(posKey)) overlayColor = 'bg-[var(--color-frontier)]';
    if (pathNodes.has(posKey)) overlayColor = 'bg-[var(--color-path)]';

    return `w-5 h-5 border border-gray-700/50 bg-[var(--color-${node.terrain})] relative ${overlayColor}`;
  };

  if (!grid.length) return <div>Carregando mapa...</div>;

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, y) =>
        row.map((node, x) => (
          <div key={`${y}-${x}`} className={getCellClass(node)}>
            {/* Renderiza o agente */}
            {agentPos.x === x && agentPos.y === y && (
              <div className="absolute inset-0 bg-[var(--color-agent)] rounded-full animate-pulse" />
            )}
            {/* Renderiza a comida */}
            {foodPos.x === x && foodPos.y === y && (
              <div className="absolute inset-0 flex items-center justify-center text-lg">
                ⭐
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}