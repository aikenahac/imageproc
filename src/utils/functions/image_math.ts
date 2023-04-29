import { Pixel } from './converts';

export function imageSubtract(img1: Pixel[][], img2: Pixel[][] | undefined) {
  if (!img2) return;

  const output: Pixel[][] = [];

  for (let i = 0; i < img1.length; i++) {
    output.push([]);

    for (let j = 0; j < img1[i].length; j++) {
      const color: Pixel = { R: 0, G: 0, B: 0, A: 255 };

      for (const key in color) {
        if (key === 'A') continue;

        color[key] = img1[i][j][key] - img2[i][j][key];

        if (color[key] > 255) color[key] = 255;
        else if (color[key] < 0) color[key] = 0;
      }

      output[i].push(color);
    }
  }

  return output;
}

export function imageSum(
  img1: Pixel[][] | undefined,
  img2: Pixel[][] | undefined,
) {
  if (!img1 || !img2) return;

  const output: Pixel[][] = [];

  for (let i = 0; i < img1.length; i++) {
    output.push([]);

    for (let j = 0; j < img1[i].length; j++) {
      const color: Pixel = { R: 0, G: 0, B: 0, A: 255 };

      for (const key in color) {
        if (key === 'A') continue;

        color[key] = img1[i][j][key] + img2[i][j][key];

        if (color[key] > 255) color[key] = 255;
        else if (color[key] < 0) color[key] = 0;
      }

      output[i].push(color);
    }
  }

  return output;
}
