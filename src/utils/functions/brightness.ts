export function setBrightness(
  data: Uint8ClampedArray | undefined,
  brightness: number,
) {
  if (!data) return;

  for (let i = 0; i < data.length; i++) {
    if ((i + 1) % 4 === 0) continue;

    data[i] = brightness * data[i];
  }
}
