import { applyFilters } from './functions/apply';
import { WorkerData } from './types';

self.onmessage = (e: MessageEvent<WorkerData>) => {
  const width = e.data.width;
  const brightness = e.data.brightness;
  const data = e.data.data;
  const stack = e.data.stack;
  const matrix = e.data.matrix;

  applyFilters(data, width, stack, brightness, matrix);

  self.postMessage(data);
};

export {};
