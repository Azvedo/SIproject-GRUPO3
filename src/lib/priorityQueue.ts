import { Node } from './types';


export class PriorityQueue {
  private elements: Node[] = [];
  private priorityKey: 'fCost' | 'gCost' | 'hCost';

  constructor(priorityKey: 'fCost' | 'gCost' | 'hCost') {
    this.priorityKey = priorityKey;
  }

  enqueue(element: Node) {
    this.elements.push(element);
    this.elements.sort((a, b) => a[this.priorityKey] - b[this.priorityKey]);
  }

  dequeue(): Node | undefined {
    return this.elements.shift();
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
  
  getValues(): Node[] {
    return this.elements;
  }
}