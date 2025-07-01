import { Node } from './types';

// A fila de prioridade é usada para sempre escolher o "melhor" nó da fronteira.
// O critério de "melhor" muda para cada algoritmo (menor fCost, gCost ou hCost).
export class PriorityQueue {
  private elements: Node[] = [];
  private priorityKey: 'fCost' | 'gCost' | 'hCost';

  constructor(priorityKey: 'fCost' | 'gCost' | 'hCost') {
    this.priorityKey = priorityKey;
  }

  // Adiciona um elemento à fila e a mantém ordenada.
  enqueue(element: Node) {
    this.elements.push(element);
    // Ordena a fila a cada inserção. Para um grande número de elementos,
    // uma estrutura de Heap seria mais eficiente, mas para este projeto,
    // um array ordenado é perfeitamente aceitável e mais simples.
    this.elements.sort((a, b) => a[this.priorityKey] - b[this.priorityKey]);
  }

  // Remove e retorna o elemento com a maior prioridade (o primeiro do array).
  dequeue(): Node | undefined {
    return this.elements.shift();
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
  
  // Retorna todos os elementos para visualização da fronteira.
  getValues(): Node[] {
    return this.elements;
  }
}