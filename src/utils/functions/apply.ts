import { boxBlur } from './blur';
import { setBrightness } from './brightness';
import { enhanceColorChannel, removeColorChannels } from './color_channels';
import { convertToOriginal } from './converts';
import { setGrayscale } from './grayscale';
import { imageSum } from './image_math';
import { applyMatrix } from './matrix';
import { sharpening, unsharping } from './sharpening';
import { setThreshold } from './threshold';

export function applyFilters(
  data: Uint8ClampedArray | undefined,
  width: number,
  stack: string[],
  brightness: number,
) {
  if (!data) return;

  stack.forEach((e) => {
    switch (e) {
      case 'grayscale':
        setGrayscale(data);
        break;
      case 'threshold':
        setThreshold(data, 128);
        break;
      case 'box-blur':
        const blur = boxBlur(
          data,
          width,
          [
            [1, 2, 1],
            [2, 4, 2],
            [1, 2, 1],
          ],
          16,
        );
        convertToOriginal(blur, data);
        break;
      case 'sharpening':
        const sharpened = sharpening(data, width);
        convertToOriginal(sharpened, data);
        break;
      case 'unsharp':
        const unsharped = unsharping(data, width);
        convertToOriginal(unsharped, data);
        break;
      case 'laplacian':
        const applied = applyMatrix(data, width, [
          [0, 1, 0],
          [1, -4, 1],
          [0, 1, 0],
        ]);
        convertToOriginal(applied, data);
        break;
      case 'sobel':
        const vertical = applyMatrix(data, width, [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ]);

        const horizontal = applyMatrix(data, width, [
          [-1, -2, -1],
          [0, 0, 0],
          [1, 2, 1],
        ]);

        const sum = imageSum(vertical, horizontal);
        convertToOriginal(sum, data);
        break;
      case 'red-cr':
      case 'green-cr':
      case 'blue-cr':
        removeColorChannels(data, {
          red: e.split('-')[0] === 'red' ? true : false,
          green: e.split('-')[0] === 'green' ? true : false,
          blue: e.split('-')[0] === 'blue' ? true : false,
        });
        break;
      case 'red-ce':
      case 'green-ce':
      case 'blue-ce':
        enhanceColorChannel(data, {
          red: e.split('-')[0] === 'red' ? true : false,
          green: e.split('-')[0] === 'green' ? true : false,
          blue: e.split('-')[0] === 'blue' ? true : false,
        });
        break;
    }
  });

  setBrightness(data, brightness);
}
