import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#818cf8',
  '#22c55e',
  '#4ade80',
  '#4f46e5',
  '#a5b4fc',
  '#16a34a',
  '#86efac',
];

export default function DataVisualization({ data, visualizationType }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);
    const numericKeys = keys.filter((key) => {
      return data.some((row) => typeof row[key] === 'number');
    });
    const labelKey = keys.find((key) => typeof data[0][key] === 'string') || keys[0];

    return data.map((row) => ({
      ...row,
      _label: row[labelKey],
    }));
  }, [data]);

  const getNumericKeys = () => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter((key) =>
      data.some((row) => typeof row[key] === 'number')
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available to visualize
      </div>
    );
  }

  if (visualizationType === 'number') {
    const value = Object.values(data[0])[0];
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl font-bold gradient-text mb-4">{value}</div>
        <div className="text-gray-600 text-lg">{Object.keys(data[0])[0]}</div>
      </div>
    );
  }

  if (visualizationType === 'bar_chart') {
    const numericKeys = getNumericKeys();
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
          <XAxis dataKey="_label" stroke="#9d174d" />
          <YAxis stroke="#9d174d" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #f0abfc',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {numericKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (visualizationType === 'line_chart') {
    const numericKeys = getNumericKeys();
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
          <XAxis dataKey="_label" stroke="#9d174d" />
          <YAxis stroke="#9d174d" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid #f0abfc',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {numericKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={3}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (visualizationType === 'pie_chart') {
    const numericKey = getNumericKeys()[0];
    const pieData = chartData.map((item) => ({
      name: item._label,
      value: item[numericKey],
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
