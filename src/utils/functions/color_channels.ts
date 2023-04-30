import { Colours } from '../types';

export function removeColorChannels(data: Uint8ClampedArray, colours: Colours) {
  const arr = ['red', 'green', 'blue'];

  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;

    data[i] = colours[arr[i % 4]] ? 0 : data[i];
  }
}

export function enhanceColorChannel(data: Uint8ClampedArray, colours: Colours) {
  const arr = ['red', 'green', 'blue'];

  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;

    data[i] = colours[arr[i % 4]] ? 255 : data[i];
  }
}
