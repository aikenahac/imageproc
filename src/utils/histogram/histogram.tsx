import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { createBucketsByColor } from './buckets';
import { Bar } from 'react-chartjs-2';

const options = {
  responsive: true,
  legend: {
    position: 'top' as const,
  },
  title: {
    display: true,
    text: 'Histogram',
  },
};

interface Props {
  data: Uint8ClampedArray | undefined;
  width: number | undefined;
}

export function Histogram({ data, width }: Props) {
  if (!data || !width) return <div></div>;

  const buckets = createBucketsByColor(data, width);

  const allLabels: string[] = [];

  buckets.R.forEach((e) => allLabels.push(e.label));
  buckets.G.forEach((e) => allLabels.push(e.label));
  buckets.B.forEach((e) => allLabels.push(e.label));

  const labels: string[] = Array.from(new Set(allLabels));

  const rY = buckets.R.map((e) => e.y);
  const gY = buckets.G.map((e) => e.y);
  const bY = buckets.B.map((e) => e.y);

  const d = {
    labels: labels,
    datasets: [
      {
        label: 'Red',
        data: rY,
        backgroundColor: '#F87272',
      },
      {
        label: 'Green',
        data: gY,
        backgroundColor: '#36D399',
      },
      {
        label: 'Blue',
        data: bY,
        backgroundColor: '#3ABff8',
      },
    ],
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  );

  return <Bar id="histogram" options={options} data={d} />;
}
