import { convertTo2D } from '../functions/converts';

export interface Buckets {
  [R: string]: any[];
  G: any[];
  B: any[];
}

export interface Count {
  [R: string]: number;
  G: number;
  B: number;
}

export function createBucketsByColor(
  data: Uint8ClampedArray,
  width: number,
): Buckets {
  const original = convertTo2D(data, width);

  const bucketCount = 5;
  const bucketSize = 255 / bucketCount;

  const buckets: Buckets = { R: [], G: [], B: [] };

  for (let k = 0; k < bucketCount; k++) {
    const startVal = k === 0 ? bucketSize * k : bucketSize * k + 1;
    const endVal = startVal + bucketSize - 1;

    const count: Count = { R: 0, G: 0, B: 0 };

    for (let i = 0; i < original.length; i++) {
      for (let j = 0; j < original[i].length; j++) {
        if (original[i][j].R >= startVal && original[i][j].R <= endVal)
          count.R++;

        if (original[i][j].G >= startVal && original[i][j].G <= endVal)
          count.G++;

        if (original[i][j].B >= startVal && original[i][j].B <= endVal)
          count.B++;
      }
    }

    buckets.R.push({
      label: `${startVal}-${endVal}`,
      y: count.R,
      x: k,
    });

    buckets.G.push({
      label: `${startVal}-${endVal}`,
      y: count.G,
      x: k,
    });

    buckets.B.push({
      label: `${startVal}-${endVal}`,
      y: count.B,
      x: k,
    });
  }

  return buckets;
}
