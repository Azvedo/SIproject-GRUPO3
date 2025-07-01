'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Grid as GridType,
  Position,
  SearchAlgorithm,
  SearchHistoryFrame
} from '@/lib/types';
import { generateRandomMap, getRandomValidPosition } from '@/lib/mapGenerator';
import { aStarSearch } from '@/lib/algorithms/astart';
import { bfsSearch } from '@/lib/algorithms/bfs';
import { greedySearch } from '@/lib/algorithms/greedy';
// Importe os outros algoritmos aqui (bfs, dfs, etc.)
import Grid from './components/Grid';
import Controls from './components/Controls';
import { dfsSearch } from '@/lib/algorithms/dfs';
import { ucsSearch } from '@/lib/algorithms/ucs';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 25;
const ANIMATION_SPEED_MS = 10; // Velocidade da animação da busca

export default function Home() {
  // Estados do Jogo
  const [grid, setGrid] = useState<GridType>([]);
  const [agentPos, setAgentPos] = useState<Position>({ x: 0, y: 0 });
  const [foodPos, setFoodPos] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  // Estados da Busca e Animação
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('A*');
  const [history, setHistory] = useState<SearchHistoryFrame[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimatingSearch, setIsAnimatingSearch] = useState(false);
  const [isAnimatingPath, setIsAnimatingPath] = useState(false);
  const [pathCost, setPathCost] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [searchStartTime, setSearchStartTime] = useState<number>(0);

  const isAnimating = isAnimatingSearch || isAnimatingPath;

  // Função para calcular o custo total do caminho
  const calculatePathCost = (path: Position[], grid: GridType): number => {
    if (path.length <= 1) return 0;
    
    let totalCost = 0;
    for (let i = 1; i < path.length; i++) {
      const pos = path[i];
      totalCost += grid[pos.y][pos.x].cost;
    }
    return totalCost;
  };

  // Função para inicializar/resetar o mapa
  const handleNewMap = useCallback(() => {
    const newGrid = generateRandomMap(MAP_WIDTH, MAP_HEIGHT);
    setGrid(newGrid);
    setAgentPos(getRandomValidPosition(newGrid));
    setFoodPos(getRandomValidPosition(newGrid));
    setHistory([]);
    setPath([]);
    setCurrentFrame(0);
    setPathCost(0);
    setSearchTime(0);
    setSearchStartTime(0);
  }, []);

  // Efeito para criar o mapa inicial
  useEffect(() => {
    handleNewMap();
  }, [handleNewMap]);

  // Função para iniciar a busca
  const handleStartSearch = () => {
    if (isAnimating) return;

    // Limpa a visualização anterior
    setHistory([]);
    setPath([]);
    setCurrentFrame(0);
    setPathCost(0);
    setSearchTime(0);
    setSearchStartTime(Date.now()); // Marca o tempo de início

    // Escolhe a função de busca correta
    let searchFunction;
    switch (algorithm) {
      case 'A*':
        searchFunction = aStarSearch;
        break;
      case 'Greedy': searchFunction = greedySearch; break;
      case 'DFS':
        searchFunction = dfsSearch;
        break;
      case 'UCS':
        searchFunction = ucsSearch;
        break;
      case 'BFS': 
        searchFunction = bfsSearch;
        break;
      default:
        searchFunction = aStarSearch;
    }

    const result = searchFunction(grid, agentPos, foodPos);
    setHistory(result.history);
    setPath(result.path);
    setIsAnimatingSearch(true);
  };

  // Efeito para animar a busca (visitados/fronteira)
  useEffect(() => {
    if (!isAnimatingSearch || currentFrame >= history.length) {
      if (isAnimatingSearch) {
        setIsAnimatingSearch(false);
        // Calcula e exibe o custo final do caminho quando a busca termina
        if (path.length > 0) {
          const cost = calculatePathCost(path, grid);
          setPathCost(cost);
          setIsAnimatingPath(true);
        }
        // Calcula o tempo final de busca
        const finalTime = Date.now() - searchStartTime;
        setSearchTime(finalTime);
      }
      return;
    }

    // Atualiza o tempo de busca em tempo real
    const currentTime = Date.now() - searchStartTime;
    setSearchTime(currentTime);

    // Atualiza o custo durante a animação baseado no progresso
    if (path.length > 0) {
      // Calcula um custo parcial baseado no progresso da animação
      const progress = currentFrame / history.length;
      const partialPath = path.slice(0, Math.ceil(path.length * progress));
      const partialCost = calculatePathCost(partialPath, grid);
      setPathCost(partialCost);
    }

    const timer = setTimeout(() => {
      setCurrentFrame(currentFrame + 1);
    }, ANIMATION_SPEED_MS);

    return () => clearTimeout(timer);
  }, [isAnimatingSearch, currentFrame, history, path, grid, searchStartTime]);

  // Efeito para animar o movimento do agente no caminho final
  useEffect(() => {
    if (!isAnimatingPath || path.length <= 1) {
      setIsAnimatingPath(false);
      return;
    }

    const moveAgent = (pathIndex: number) => {
      if (pathIndex >= path.length) {
        // Chegou ao fim
        setScore((prev) => prev + 1);
        const newFoodPos = getRandomValidPosition(grid);
        setFoodPos(newFoodPos);
        // setPath([]); // Limpa o caminho para a próxima busca
        setIsAnimatingPath(false);
        return;
      }

      const nextPos = path[pathIndex];
      const currentTerrainCost = grid[nextPos.y][nextPos.x].cost;

      // A velocidade do agente é inversamente proporcional ao custo do terreno
      // Custo alto -> delay maior -> movimento mais lento
      const delay = 50 * currentTerrainCost;

      setAgentPos(nextPos);

      setTimeout(() => moveAgent(pathIndex + 1), delay);
    };

    moveAgent(1); // Começa do segundo nó do caminho
  }, [isAnimatingPath, path, grid]);

  // Memoiza os sets de nós para otimizar a renderização do Grid
  const { visitedNodes, frontierNodes, pathNodes } = useMemo(() => {
    const frame = history[currentFrame - 1];
    return {
      visitedNodes: new Set(frame?.visited.map((p) => `${p.y}-${p.x}`)),
      frontierNodes: new Set(frame?.frontier.map((p) => `${p.y}-${p.x}`)),
      pathNodes: new Set(
        isAnimatingPath || !isAnimatingSearch
          ? path.map((p) => `${p.y}-${p.x}`)
          : []
      )
    };
  }, [currentFrame, history, path, isAnimatingPath, isAnimatingSearch]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Agente Coletor de Comida</h1>
      <Controls
        selectedAlgorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        onStartSearch={handleStartSearch}
        onNewMap={handleNewMap}
        isAnimating={isAnimating}
        pathCost={pathCost}
        searchTime={searchTime}
        score={score}
      />
      <Grid
        grid={grid}
        agentPos={agentPos}
        foodPos={foodPos}
        visitedNodes={visitedNodes}
        frontierNodes={frontierNodes}
        pathNodes={pathNodes}
      />
    </main>
  );
}
