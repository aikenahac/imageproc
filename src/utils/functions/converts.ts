export interface Pixel {
  [R: string]: number;
  G: number;
  B: number;
  A: number;
}

export function convertToOriginal(
  pixels: Pixel[][] | undefined,
  data: Uint8ClampedArray,
) {
  if (!pixels) return;

  let i = 0;

  pixels.forEach((el) => {
    el.forEach((value) => {
      data[i] = value.R;
      data[i + 1] = value.G;
      data[i + 2] = value.B;
      data[i + 3] = value.A;
      i += 4;
    });
  });
}

export function convertTo2D(data: Uint8ClampedArray, imgWidth: number) {
  const pixels: Pixel[][] = [[]];

  let row = 0;
  for (let i = 0; i < data.length; i = i + 4) {
    pixels[row].push({
      R: data[i],
      G: data[i + 1],
      B: data[i + 2],
      A: data[i + 3],
    });

    if (i / 4 === imgWidth * (row + 1)) {
      pixels.push([]);
      row++;
    }
  }

  return pixels;
}
