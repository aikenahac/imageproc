import { useState } from 'react';

function App() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [brightness, setBrightness] = useState(1);
  const [loading, setLoading] = useState(false);

  const onImageSelect = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onBrightnessChange = (event: any) => {
    setBrightness(event.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-start pt-4 pl-4 pb-4 space-y-4">
      <input
        type="file"
        onChange={onImageSelect}
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
      />
      <div className="flex space-x-8">
        <img src={image} className="max-w-2xl	max-h-96" />
        <img src={image} className="max-w-2xl	max-h-96" />
      </div>
      <p className="font-bold text-xl">Actions</p>
      <div className="grid gap-4 grid-cols-4">
        <button className="btn">Grayscale</button>
        <button className="btn">Threshold</button>
        <button className="btn">Box Blur</button>
        <button className="btn">Sharpening</button>
        <button className="btn">Unsharp Masking</button>
        <button className="btn">Laplacian</button>
        <button className="btn">Sobel</button>
        <button className="btn">Median</button>
      </div>
      <p className="font-bold text-xl">Color Channel Removal</p>
      <div className="flex flex-row space-x-4">
        <button className="btn">Red</button>
        <button className="btn">Green</button>
        <button className="btn">Blue</button>
      </div>
      <p className="font-bold text-xl">Color Channel Enhancing</p>
      <div className="flex flex-row space-x-4">
        <button className="btn">Red</button>
        <button className="btn">Green</button>
        <button className="btn">Blue</button>
      </div>
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
      <div className="flex flex-row space-x-4">
        <button className="btn btn-error">Clear</button>
        <button className="btn btn-primary">Undo</button>
        <button className={`btn btn-primary ${loading ? 'loading' : ''}`}>
          Apply
        </button>
      </div>
    </div>
  );
}

export default App;
