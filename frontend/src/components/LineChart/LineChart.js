import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const LineChartComponent = ({dataSet, dataLines}) => (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={dataSet}
            margin={{
              top: 20,
              right: 20,
              left: 100,
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="announced_on" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataLines.map(dataLine => <Line key={dataLine.key} connectNulls type="monotone" dataKey={dataLine.key} stroke={dataLine.color} />)}
          </LineChart>
        </ResponsiveContainer>
);