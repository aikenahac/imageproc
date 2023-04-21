import { Pixel, convertTo2D } from './converts';

export function boxBlur(
  data: Uint8ClampedArray,
  imgWidth: number,
  matrix: number[][],
  div: number,
) {
  let pixels = convertTo2D(data, imgWidth);

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

      const colour: Pixel = { R: 0, G: 0, B: 0, A: 255 };

      matrix.forEach((m, my) => {
        m.forEach((mult, mx) => {
          const pixel = pixels[y + my - edgeOffset][x + mx - edgeOffset];
          colour.R += pixel.R * mult;
          colour.G += pixel.G * mult;
          colour.B += pixel.B * mult;
        });
      });

      for (const [key, value] of Object.entries(colour)) {
        if (key === 'A') continue;

        colour[key] = Math.floor(value / div);
      }

      return colour;
    });
  });

  return arr;
}
