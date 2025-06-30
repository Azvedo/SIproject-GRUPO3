// app/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Grid as GridType, Position, SearchAlgorithm, SearchHistoryFrame } from '@/lib/types';
import { generateRandomMap, getRandomValidPosition } from '@/lib/mapGenerator';
import { aStarSearch } from '@/lib/algorithms/astart';
// Importe os outros algoritmos aqui (bfs, dfs, etc.)
import Grid from './components/Grid';
import Controls from './components/Controls';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 25;
const ANIMATION_SPEED_MS = 20; // Velocidade da animação da busca

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
  
  const isAnimating = isAnimatingSearch || isAnimatingPath;

  // Função para inicializar/resetar o mapa
  const handleNewMap = useCallback(() => {
    const newGrid = generateRandomMap(MAP_WIDTH, MAP_HEIGHT);
    setGrid(newGrid);
    setAgentPos(getRandomValidPosition(newGrid));
    setFoodPos(getRandomValidPosition(newGrid));
    setHistory([]);
    setPath([]);
    setCurrentFrame(0);
    // Opcional: resetar o placar a cada novo mapa
    setScore(0);
  }, []);

  // Efeito para criar o mapa inicial
  useEffect(() => {
    handleNewMap();
  }, [handleNewMap]);

  // Função para iniciar a busca
  const handleStartSearch = () => {
    if (isAnimating) return;
    
    // Limpa a visualização anterior para a nova busca
    setHistory([]);
    setPath([]);
    setCurrentFrame(0);
    
    // Escolhe a função de busca correta
    let searchFunction;
    switch (algorithm) {
      case 'A*': searchFunction = aStarSearch; break;
      // Adicione os outros casos aqui
      // case 'BFS': searchFunction = bfsSearch; break;
      default: searchFunction = aStarSearch;
    }
    
    const result = searchFunction(grid, agentPos, foodPos);
    setHistory(result.history);
    setPath(result.path);
    setIsAnimatingSearch(true);
  };

  // Efeito para animar a busca (visitados/fronteira)
  useEffect(() => {
    if (!isAnimatingSearch || currentFrame >= history.length) {
      if(isAnimatingSearch) {
        setIsAnimatingSearch(false);
        if(path.length > 0) setIsAnimatingPath(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentFrame(currentFrame + 1);
    }, ANIMATION_SPEED_MS);

    return () => clearTimeout(timer);
  }, [isAnimatingSearch, currentFrame, history]);

  // Efeito para animar o movimento do agente no caminho final
  useEffect(() => {
    if (!isAnimatingPath || path.length <= 1) {
        setIsAnimatingPath(false);
        return;
    }

    const moveAgent = (pathIndex: number) => {
        if (pathIndex >= path.length) {
            // ================== MUDANÇAS APLICADAS AQUI ==================
            // O agente chegou ao seu destino (a comida).

            // 1. O placar é incrementado. (Isso permanece)
            setScore(prev => prev + 1);

            // 2. O caminho e a posição da comida NÃO são mais resetados.
            //    Eles permanecerão na tela. As linhas abaixo foram removidas:
            //    const newFoodPos = getRandomValidPosition(grid); // REMOVIDO
            //    setFoodPos(newFoodPos); // REMOVIDO
            //    setPath([]); // REMOVIDO

            // 3. A animação do caminho simplesmente para.
            setIsAnimatingPath(false);
            return;
            // ==============================================================
        }

        const nextPos = path[pathIndex];
        const currentTerrainCost = grid[nextPos.y][nextPos.x].cost;
        
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
        visitedNodes: new Set(frame?.visited.map(p => `${p.y}-${p.x}`)),
        frontierNodes: new Set(frame?.frontier.map(p => `${p.y}-${p.x}`)),
        // A lógica para mostrar o caminho final foi ajustada para que ele
        // permaneça visível mesmo após o fim da animação.
        pathNodes: new Set((isAnimatingPath || (!isAnimatingSearch && path.length > 0)) ? path.map(p => `${p.y}-${p.x}`) : [])
    };
  }, [currentFrame, history, path, isAnimatingPath, isAnimatingSearch]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-4">Agente Coletor de Comida - IA</h1>
      <Controls
        selectedAlgorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        onStartSearch={handleStartSearch}
        onNewMap={handleNewMap}
        isAnimating={isAnimating}
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