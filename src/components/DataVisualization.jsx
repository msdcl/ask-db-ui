import { useMemo } from 'react';
import PropTypes from 'prop-types';
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
import { CHART_COLORS, CHART_HEIGHT } from '../config/constants';
import { TrendingUp, Hash, PieChart as PieIcon, Table as TableIcon } from 'lucide-react';

// Pastel chart colors matching our design system
const PASTEL_COLORS = [
  '#8b5cf6', // primary-600
  '#14b8a6', // accent-500
  '#0ea5e9', // sky-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#a855f7', // purple-500
  '#22c55e', // green-500
  '#6366f1', // indigo-500
];

export default function DataVisualization({ data, visualizationType }) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== 'object') return [];

    const keys = Object.keys(firstRow);
    if (keys.length === 0) return [];

    const labelKey = keys.find((key) => typeof firstRow[key] === 'string') || keys[0];

    return data.map((row) => ({
      ...row,
      _label: row[labelKey],
    }));
  }, [data]);

  const numericKeys = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== 'object') return [];

    return Object.keys(firstRow).filter((key) =>
      data.some((row) => typeof row[key] === 'number')
    );
  }, [data]);

  // Empty state
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="empty-state py-12">
        <TableIcon className="empty-state-icon w-12 h-12" />
        <p className="empty-state-title text-base">No data available</p>
        <p className="empty-state-description text-sm">
          Execute a query to see results here
        </p>
      </div>
    );
  }

  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') {
    return (
      <div className="empty-state py-12">
        <TableIcon className="empty-state-icon w-12 h-12" />
        <p className="empty-state-title text-base">Invalid data format</p>
      </div>
    );
  }

  // Number visualization (single value)
  if (visualizationType === 'number') {
    const keys = Object.keys(firstRow);
    if (keys.length === 0) {
      return (
        <div className="empty-state py-12">
          <Hash className="empty-state-icon w-12 h-12" />
          <p className="empty-state-title text-base">No data to display</p>
        </div>
      );
    }
    const value = firstRow[keys[0]];
    const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mb-4 shadow-soft-lg">
          <Hash className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
        </div>
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-3">
          {formattedValue}
        </div>
        <div className="text-secondary-500 text-sm sm:text-base font-medium">{keys[0]}</div>
      </div>
    );
  }

  // Bar Chart
  if (visualizationType === 'bar_chart') {
    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="_label"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: '#64748b' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              iconSize={8}
            />
            {numericKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                radius={[6, 6, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Line Chart
  if (visualizationType === 'line_chart') {
    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="_label"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: '#64748b' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              iconSize={8}
            />
            {numericKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                strokeWidth={3}
                dot={{ fill: PASTEL_COLORS[index % PASTEL_COLORS.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Pie Chart
  if (visualizationType === 'pie_chart') {
    const numericKey = numericKeys[0];
    if (!numericKey) {
      return (
        <div className="empty-state py-12">
          <PieIcon className="empty-state-icon w-12 h-12" />
          <p className="empty-state-title text-base">No numeric data for pie chart</p>
        </div>
      );
    }

    const pieData = chartData.map((item) => ({
      name: item._label,
      value: item[numericKey],
    }));

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PASTEL_COLORS[index % PASTEL_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
              }}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
              itemStyle={{ color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default: Table view
  const tableKeys = Object.keys(firstRow);

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {tableKeys.map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 20}ms` }}>
              {tableKeys.map((key) => (
                <td key={key}>
                  {typeof row[key] === 'number' ? row[key].toLocaleString() : String(row[key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataVisualization.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  visualizationType: PropTypes.oneOf(['number', 'bar_chart', 'line_chart', 'pie_chart', 'table']),
};

DataVisualization.defaultProps = {
  data: [],
  visualizationType: 'table',
};
