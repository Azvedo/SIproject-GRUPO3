'use client';

import { SearchAlgorithm } from '@/lib/types';

interface ControlsProps {
  selectedAlgorithm: SearchAlgorithm;
  onAlgorithmChange: (algorithm: SearchAlgorithm) => void;
  onStartSearch: () => void;
  onNewMap: () => void;
  isAnimating: boolean;
  pathCost: number;
  searchTime: number;
  score: number;
  isAnimatingSearch: boolean;
  isPaused: boolean;
  onPause: () => void;
  onRestart: () => void;
}

export default function Controls({
  selectedAlgorithm,
  onAlgorithmChange,
  onStartSearch,
  onNewMap,
  isAnimating,
  pathCost,
  searchTime,
  score,
  isAnimatingSearch,
  isPaused,
  onPause,
  onRestart,
}: ControlsProps) {
  const algorithms: SearchAlgorithm[] = ['A*', 'Greedy', 'UCS', 'BFS', 'DFS'];

  return (
    <div className="my-4 p-4 bg-gray-800 rounded-lg flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <label htmlFor="algorithm-select" className="font-bold text-white">Algoritmo:</label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as SearchAlgorithm)}
          disabled={isAnimating}
          className="bg-gray-700 text-white p-2 rounded border border-gray-600"
        >
          {algorithms.map((alg) => (
            <option key={alg} value={alg}>
              {alg}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onStartSearch}
          disabled={isAnimating}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Iniciar Busca
        </button>
        <button
          onClick={onPause}
          disabled={!isAnimatingSearch}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isPaused ? 'Continuar' : 'Pausar'}
        </button>
        <button
          onClick={onRestart}
          disabled={!isAnimatingSearch}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Parar
        </button>
        <button
          onClick={onNewMap}
          disabled={isAnimating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Novo Mapa
        </button>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="text-lg text-white font-bold">
          Comidas Coletadas: <span className="text-yellow-400">{score}</span>
        </div>
        <div className="text-lg text-white font-bold">
          Custo do Caminho: <span className="text-green-400">{pathCost > 0 ? pathCost : '-'}</span>
        </div>
        <div className="text-lg text-white font-bold">
          Tempo de Busca: <span className="text-blue-400">
            {searchTime > 0 ? (
              Math.floor(searchTime / 1000) > 0 ? `${Math.floor(searchTime / 1000)}s` : '<1s'
            ) : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}