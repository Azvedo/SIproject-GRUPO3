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
import Grid from './components/Grid';
import Controls from './components/Controls';
import { dfsSearch } from '@/lib/algorithms/dfs';
import { ucsSearch } from '@/lib/algorithms/ucs';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 25;
const ANIMATION_SPEED_MS = 10; 

export default function Home() {
  const [grid, setGrid] = useState<GridType>([]);
  const [agentPos, setAgentPos] = useState<Position>({ x: 0, y: 0 });
  const [foodPos, setFoodPos] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);

  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('A*');
  const [history, setHistory] = useState<SearchHistoryFrame[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimatingSearch, setIsAnimatingSearch] = useState(false);
  const [isAnimatingPath, setIsAnimatingPath] = useState(false);
  const [pathCost, setPathCost] = useState<number>(0);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [searchStartTime, setSearchStartTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pausedFrame, setPausedFrame] = useState<number>(0);

  const isAnimating = isAnimatingSearch || isAnimatingPath;

  const calculatePathCost = (path: Position[], grid: GridType): number => {
    if (path.length <= 1) return 0;
    
    let totalCost = 0;
    for (let i = 1; i < path.length; i++) {
      const pos = path[i];
      totalCost += grid[pos.y][pos.x].cost;
    }
    return totalCost;
  };

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
    setIsPaused(false);
    setPausedFrame(0);
  }, []);

  useEffect(() => {
    handleNewMap();
  }, [handleNewMap]);

  const handleStartSearch = () => {
    if (isAnimating) return;

    setHistory([]);
    setPath([]);
    setCurrentFrame(0);
    setPathCost(0);
    setSearchTime(0);
    setSearchStartTime(Date.now());
    setIsPaused(false);
    setPausedFrame(0);

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

  useEffect(() => {
    if (!isAnimatingSearch || currentFrame >= history.length || isPaused) {
      if (isAnimatingSearch && currentFrame >= history.length) {
        setIsAnimatingSearch(false);
        if (path.length > 0) {
          const cost = calculatePathCost(path, grid);
          setPathCost(cost);
          setIsAnimatingPath(true);
        }
        const finalTime = Date.now() - searchStartTime;
        setSearchTime(finalTime);
      }
      return;
    }

    if (!isPaused) {
      const currentTime = Date.now() - searchStartTime;
      setSearchTime(currentTime);
    }

    if (path.length > 0) {
      const progress = currentFrame / history.length;
      const partialPath = path.slice(0, Math.ceil(path.length * progress));
      const partialCost = calculatePathCost(partialPath, grid);
      setPathCost(partialCost);
    }

    const timer = setTimeout(() => {
      setCurrentFrame(currentFrame + 1);
    }, ANIMATION_SPEED_MS);

    return () => clearTimeout(timer);
  }, [isAnimatingSearch, currentFrame, history, path, grid, searchStartTime, isPaused]);

  useEffect(() => {
    if (!isAnimatingPath || path.length <= 1) {
      setIsAnimatingPath(false);
      return;
    }

    const moveAgent = (pathIndex: number) => {
      if (pathIndex >= path.length) {
        setScore((prev) => prev + 1);
        const newFoodPos = getRandomValidPosition(grid);
        setFoodPos(newFoodPos);
        setIsAnimatingPath(false);
        return;
      }

      const nextPos = path[pathIndex];
      const currentTerrainCost = grid[nextPos.y][nextPos.x].cost;

      const delay = 50 * currentTerrainCost;

      setAgentPos(nextPos);

      setTimeout(() => moveAgent(pathIndex + 1), delay);
    };

    moveAgent(1); // Começa do segundo nó do caminho
  }, [isAnimatingPath, path, grid]);

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

  const handlePause = () => {
    if (isAnimatingSearch && !isPaused) {
      setIsPaused(true);
      setPausedFrame(currentFrame);
    } else if (isPaused) {
      setIsPaused(false);
      setSearchStartTime(Date.now() - searchTime); 
    }
  };

  const handleRestart = () => {
    if (isAnimatingSearch) {
      setIsAnimatingSearch(false);
      setIsAnimatingPath(false);
      setCurrentFrame(0);
      setPathCost(0);
      setSearchTime(0);
      setSearchStartTime(0);
      setIsPaused(false);
      setPausedFrame(0);
      setHistory([]);
      setPath([]);
    }
  };

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
        isAnimatingSearch={isAnimatingSearch}
        isPaused={isPaused}
        onPause={handlePause}
        onRestart={handleRestart}
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
