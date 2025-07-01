'use client';

import { Terrain } from '@/lib/types';

export default function Legend() {
  const terrainInfo = [
    {
      terrain: Terrain.LowCost,
      name: 'Areia',
      cost: 1,
      color: 'bg-[var(--color-sand)]',
      description: 'Terreno fácil de atravessar'
    },
    {
      terrain: Terrain.MediumCost,
      name: 'Atoleiro',
      cost: 5,
      color: 'bg-[var(--color-mud)]',
      description: 'Terreno moderadamente difícil'
    },
    {
      terrain: Terrain.HighCost,
      name: 'Água',
      cost: 10,
      color: 'bg-[var(--color-water)]',
      description: 'Terreno difícil de atravessar'
    },
    {
      terrain: Terrain.Obstacle,
      name: 'Obstáculo',
      cost: '∞',
      color: 'bg-[var(--color-obstacle)]',
      description: 'Intransponível'
    }
  ];

  const visualInfo = [
    {
      name: 'Agente',
      color: 'bg-[var(--color-agent)]',
      shape: 'rounded-full',
      description: 'Posição atual do agente'
    },
    {
      name: 'Comida',
      color: 'bg-transparent',
      symbol: '⭐',
      description: 'Objetivo a ser alcançado'
    },
    {
      name: 'Caminho',
      color: 'bg-[var(--color-path)]',
      description: 'Caminho encontrado pelo algoritmo'
    },
    {
      name: 'Visitados',
      color: 'bg-[var(--color-visited)]',
      description: 'Nós explorados durante a busca'
    },
    {
      name: 'Fronteira',
      color: 'bg-[var(--color-frontier)]',
      description: 'Nós na fila para serem explorados'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 w-64 text-white">
      <h3 className="text-lg font-bold mb-3 text-center">Legenda</h3>
      
      {/* Seção de Terrenos */}
      <div className="mb-4">
        <h4 className="text-md font-semibold mb-2 text-gray-300">Tipos de Terreno</h4>
        <div className="space-y-2">
          {terrainInfo.map((info) => (
            <div key={info.terrain} className="flex items-center gap-2">
              <div className={`w-4 h-4 border border-black/20 ${info.color}`} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{info.name}</span>
                  <span className="text-xs bg-gray-700 px-1 rounded">
                    {info.cost}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{info.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Elementos Visuais */}
      <div>
        <h4 className="text-md font-semibold mb-2 text-gray-300">Elementos Visuais</h4>
        <div className="space-y-2">
          {visualInfo.map((info) => (
            <div key={info.name} className="flex items-center gap-2">
              <div className={`w-4 h-4 border border-black/20 ${info.color} ${info.shape || ''} flex items-center justify-center text-xs`}>
                {info.symbol || ''}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{info.name}</div>
                <div className="text-xs text-gray-400">{info.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
