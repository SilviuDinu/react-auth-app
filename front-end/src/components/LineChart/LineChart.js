import React from 'react';
import {
  LineChart as LineGraph,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function LineChart(props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineGraph
        width={1000}
        height={400}
        data={props.data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineGraph>
    </ResponsiveContainer>
  );
}

export default LineChart;
