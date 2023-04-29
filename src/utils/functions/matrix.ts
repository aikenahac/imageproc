import { Pixel, convertTo2D } from './converts';

export function applyMatrix(
  data: Uint8ClampedArray | undefined,
  width: number,
  matrix: number[][],
) {
  if (!data) return;

  let pixels = convertTo2D(data, width);

  const arr = pixels.map((el, y) => {
    return el.map((value, x) => {
      const edgeOffset = (matrix.length - 1) / 2;
      if (
        y + edgeOffset >= pixels.length - 1 ||
        x + edgeOffset >= el.length - 1 ||
        x < edgeOffset ||
        y < edgeOffset
      )
        return value;

      const color: Pixel = { R: 0, G: 0, B: 0, A: 255 };

      matrix.forEach((m, my) => {
        m.forEach((mult, mx) => {
          const pixel = pixels[y + my - edgeOffset][x + mx - edgeOffset];

          const brightness =
            0.299 * pixel.R + 0.587 * pixel.G + 0.114 * pixel.B;
          const val = brightness * mult;

          color.R += val;
          color.G += val;
          color.B += val;
        });
      });

      for (const [key, value] of Object.entries(color)) {
        if (key === 'A') continue;

        color[key] = Math.floor(value);

        console.log(color[key]);

        if (value > 255) color[key] = 255;
        else if (value < 0) color[key] = 0;
      }

      return color;
    });
  });

  return arr;
}
