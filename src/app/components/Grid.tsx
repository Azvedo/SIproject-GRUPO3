// app/components/Grid.tsx
'use client';

import { Grid as GridType, Node, Position } from '@/lib/types';

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

  const getCellClass = (node: Node) => {
    const posKey = `${node.y}-${node.x}`;
    let overlayColorClass = '';

    // A ordem é importante para a sobreposição de cores.
    if (visitedNodes.has(posKey)) overlayColorClass = 'bg-[var(--color-visited)]';
    if (frontierNodes.has(posKey)) overlayColorClass = 'bg-[var(--color-frontier)]';
    if (pathNodes.has(posKey)) overlayColorClass = 'bg-[var(--color-path)]';

    
    return `w-5 h-5 border border-black/10 bg-[var(--color-${node.terrain})] relative ${overlayColorClass}`;
  };

  if (!grid.length) return <div>Carregando mapa...</div>;

  return (
    <div
      className="inline-grid"
      style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
    >
      {grid.map((row) =>
        row.map((node) => (
          <div key={`${node.y}-${node.x}`} className={getCellClass(node)}>
            {agentPos.x === node.x && agentPos.y === node.y && (
              <div className="absolute inset-0 bg-[var(--color-agent)] rounded-full animate-pulse" />
            )}
            {foodPos.x === node.x && foodPos.y === node.y && (
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