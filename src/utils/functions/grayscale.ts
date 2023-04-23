export function setGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i = i + 4) {
    const val = 0.299 * data[i] + 0.587 * data[i] + 0.114 * data[i];
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    continue;
  }
}
