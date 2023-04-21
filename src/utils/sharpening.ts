import { boxBlur } from './blur';
import { convertTo2D } from './converts';
import { imageSubtract, imageSum } from './image_math';
import { applyMatrix } from './matrix';

export function sharpening(data: Uint8ClampedArray | undefined, width: number) {
  if (!data) return;

  const laplaceOperator = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0],
  ];

  const original = convertTo2D(data, width);
  const laplaced = applyMatrix(data, width, laplaceOperator);

  const output = imageSubtract(original, laplaced);

  return output;
}

export function unsharping(data: Uint8ClampedArray | undefined, width: number) {
  if (!data) return;

  const gaussian = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1],
  ];

  const originalImg = convertTo2D(data, width);
  const appliedBlur = boxBlur(data, width, gaussian, 16);

  const substitution = imageSubtract(originalImg, appliedBlur);

  const output = imageSum(originalImg, substitution);

  return output;
}
