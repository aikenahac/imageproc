import { useState, useRef } from 'react';
import { Histogram } from './utils/histogram/histogram';
import { WorkerData } from './utils/types';

function App() {
  const [imageUrl, setImageUrl] = useState<string>();
  const [imgWidth, setImgWidth] = useState<number>();
  const imageRef = useRef<HTMLImageElement>(null);

  const [outputUrl, setOutputUrl] = useState<string>();
  const outputRef = useRef<HTMLImageElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [brightness, setBrightness] = useState(1);
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrix, setMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const [stack, setStack] = useState<string[]>([]);

  const [data, setData] = useState<Uint8ClampedArray>();

  const onImageSelect = (event: any) => {
    if (outputUrl) {
      const output = outputRef.current;
      if (output) output.src = '';
    }
    if (event.target.files && event.target.files[0]) {
      setStack([]);
      setBrightness(1);
      setImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onBrightnessChange = (event: any) => {
    setBrightness(event.target.value);
  };

  const onMatrixSizeChange = (event: any) => {
    const size = parseInt(event.target.value);
    let tmp = [...matrix];

    const matrixSizes: Record<number, number[][]> = {
      3: emptyMatrix3x3,
      5: emptyMatrix5x5,
      7: emptyMatrix7x7,
      9: emptyMatrix9x9,
    };

    tmp = matrixSizes[size];

    setMatrix(tmp);
    setMatrixSize(event.target.value);
  };

  const addFilter = (filter: string) => {
    console.log(`adding ${filter}`);
    const tmpStack = stack;
    tmpStack.push(filter);
    setStack([...tmpStack]);
  };

  const apply = async () => {
    console.log(stack);

    await useWorker();
  };

  const useWorker = async () => {
    new Promise(() => {
      const image = imageRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !imageUrl || !image) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) return;

      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;

      ctx?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

      const imageData = ctx.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );

      setImgWidth(image.naturalWidth);
      const worker = new Worker(new URL('./utils/worker.ts', import.meta.url), {
        type: 'module',
      });

      const d: WorkerData = {
        data: imageData.data,
        width: image.naturalWidth,
        brightness: brightness,
        stack: stack,
        matrix: matrix,
      };

      worker.postMessage(d);

      worker.onmessage = (e: MessageEvent<Uint8ClampedArray>) => {
        setData(e.data);
        imageData.data.set(e.data);

        ctx.putImageData(imageData, 0, 0);

        let img = new Image();
        img.id = 'img2';
        img.src = canvas.toDataURL();
        setOutputUrl(canvas.toDataURL());
      };
    });
  };

  const undo = () => {
    const tmp = stack;
    tmp.pop();

    setStack([...tmp]);
    apply();
  };

  const clear = () => {
    const tmp = stack;
    tmp.length = 0;
    setStack([...tmp]);
    setBrightness(1);
    apply();
  };

  const generateColumns = (n: number, row: number) => {
    const cols = [];

    for (let c = 0; c < n; c++) {
      cols.push(
        <td key={`r${row}c${c}`}>
          <input
            type="number"
            placeholder="0"
            value={matrix[row][c]}
            onChange={(e) => {
              const tmp = [...matrix];
              tmp[row][c] = parseInt(e.target.value);
              setMatrix(tmp);
            }}
            className="input w-16 mr-1 mb-1"
          />
        </td>,
      );
    }

    return cols;
  };

  const renderMatrix = (n: number) => {
    const rows = [];

    for (let r = 0; r < n; r++) {
      rows.push(<tr key={`r${r}`}>{generateColumns(n, r)}</tr>);
    }

    return rows;
  };

  return (
    <div className="h-100h w-100w flex flex-col">
      <div className="flex flex-col justify-center items-start pt-4 pl-4 pb-4 space-y-4">
        <input
          type="file"
          onChange={onImageSelect}
          className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        />
        <div className="flex space-x-8">
          <img src={imageUrl} className="max-w-2xl	max-h-96" ref={imageRef} />
          <img src={outputUrl} className="max-w-2xl	max-h-96" ref={outputRef} />
          <canvas ref={canvasRef} hidden />
        </div>
        <div className="flex justify-between items-center w-80w">
          <div className="flex flex-col justify-center items-start space-y-4">
            <div className="flex flex-row space-x-4">
              <button
                className={`btn btn-error ${!imageUrl ? 'btn-disabled' : ''}`}
                onClick={() => clear()}
              >
                Clear
              </button>
              <button
                className={`btn btn-primary ${!imageUrl ? 'btn-disabled' : ''}`}
                onClick={() => undo()}
              >
                Undo
              </button>
              <button
                className={`btn btn-primary ${!imageUrl ? 'btn-disabled' : ''}`}
                onClick={() => apply()}
              >
                Apply
              </button>
            </div>
            <p className="font-bold text-xl">Actions</p>
            <div className="grid gap-4 grid-cols-4">
              <button
                onClick={() => addFilter('grayscale')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Grayscale
              </button>
              <button
                onClick={() => addFilter('threshold')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Threshold
              </button>
              <button
                onClick={() => addFilter('box-blur')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Box Blur
              </button>
              <button
                onClick={() => addFilter('sharpening')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Sharpening
              </button>
              <button
                onClick={() => addFilter('unsharp')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Unsharp Masking
              </button>
              <button
                onClick={() => addFilter('laplacian')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Laplacian
              </button>
              <button
                onClick={() => addFilter('sobel')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Sobel
              </button>
            </div>
            <p className="font-bold text-xl">Color Channel Removal</p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={() => addFilter('red-cr')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Red
              </button>
              <button
                onClick={() => addFilter('green-cr')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Green
              </button>
              <button
                onClick={() => addFilter('blue-cr')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Blue
              </button>
            </div>
            <p className="font-bold text-xl">Color Channel Enhancing</p>
            <div className="flex flex-row space-x-4">
              <button
                onClick={() => addFilter('red-ce')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Red
              </button>
              <button
                onClick={() => addFilter('green-ce')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Green
              </button>
              <button
                onClick={() => addFilter('blue-ce')}
                className={`btn ${!imageUrl ? 'btn-disabled' : ''}`}
              >
                Blue
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="font-bold text-xl">
                Custom Matrix Input [{matrixSize}x{matrixSize}]
              </p>
              <div>
                <input
                  type="range"
                  min={3}
                  max={9}
                  step={2}
                  value={matrixSize}
                  onChange={onMatrixSizeChange}
                  className="range range-primary"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
              </div>
            </div>
            <table className="table-auto">
              <tbody>{renderMatrix(matrixSize)}</tbody>
            </table>
            <button
              className={`btn btn-primary ${!imageUrl ? 'btn-disabled' : ''}`}
              onClick={() => {
                console.log(matrix);
                addFilter('matrix');
              }}
            >
              Add Matrix
            </button>
            <p className="font-bold text-xl">Brightness [{brightness}]</p>
            <input
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={brightness}
              onChange={onBrightnessChange}
              className="range range-primary w-96"
            />
          </div>
          <div>
            <p className="font-bold text-xl mb-1">Applied Filters</p>
            <div className="overflow-y-auto h-96 overflow-x-hidden">
              <table className="table table-compact w-96">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Filter</th>
                  </tr>
                </thead>
                <tbody>
                  {stack.map((el, i) => {
                    let filter = el;

                    switch (el) {
                      case 'red-cr':
                        filter = 'Red Channel Removal';
                        break;
                      case 'green-cr':
                        filter = 'Green Channel Removal';
                        break;
                      case 'blue-cr':
                        filter = 'Blue Channel Removal';
                        break;
                      case 'red-ce':
                        filter = 'Red Channel Enhancing';
                        break;
                      case 'green-ce':
                        filter = 'Green Channel Enhancing';
                        break;
                      case 'blue-ce':
                        filter = 'Blue Channel Enhancing';
                        break;
                      case 'box-blur':
                        filter = 'Box blur';
                        break;
                      case 'matrix':
                        filter = `Custom ${matrixSize}x${matrixSize} matrix`;
                        break;
                      default:
                        const initial = el.charAt(0).toUpperCase();
                        const rest = el.slice(1);

                        filter = initial + rest;
                    }

                    return (
                      <tr key={i}>
                        <th>{i}</th>
                        <td>{filter}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="font-bold text-xl">Histogram</p>
        <Histogram data={data} width={imgWidth} />
      </div>
      <div className="grow"></div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>
            <a href="https://github.com/aikenahac/imageproc" target="_blank">
              View the source code
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

const emptyMatrix3x3 = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const emptyMatrix5x5 = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const emptyMatrix7x7 = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const emptyMatrix9x9 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
