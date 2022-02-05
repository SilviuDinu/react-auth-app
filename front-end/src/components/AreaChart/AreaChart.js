import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart as AreaGraph,
  Area,
} from 'recharts';

function AreaChart(props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaGraph
        width={1000}
        height={400}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} fill="#8884d8" />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </AreaGraph>
    </ResponsiveContainer>
  );
}

export default AreaChart;
