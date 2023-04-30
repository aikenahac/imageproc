import { applyFilters } from './functions/apply';
import { WorkerData } from './types';

self.onmessage = (e: MessageEvent<WorkerData>) => {
  let width = e.data.width;
  let brightness = e.data.brightness;
  let data = e.data.data;
  let stack = e.data.stack;

  applyFilters(data, width, stack, brightness);

  self.postMessage(data);
};

export {};
