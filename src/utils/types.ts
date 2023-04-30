export interface WorkerData {
  width: number;
  brightness: number;
  data: Uint8ClampedArray | undefined;
  stack: string[];
}

export interface Colours {
  [red: string]: boolean;
  green: boolean;
  blue: boolean;
}

export interface Pixel {
  [R: string]: number;
  G: number;
  B: number;
  A: number;
}

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
