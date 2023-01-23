import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
import './ScatterPlot.css';


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Company name: ${payload[0].payload.company_name}`}</p>
          {payload.map(({name, value, unit}) => <p className="desc" key={name}>{`${name}: ${value} ${unit}`}</p>)}
        </div>
      );
    }
  
    return null;
  };

export const ScatterPlot = ({dataCollections}) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 100,
            }}
            >
            <CartesianGrid />
            <XAxis type="number" dataKey="funding_rounds" name="Funding rounds" unit="rounds" />
            <YAxis type="number" dataKey="funding_total_usd" name="Total funding" unit="USD" />
            <ZAxis type="number" dataKey="employees" range={[70, 700]} name="Employees" unit="persons" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
                { dataCollections && dataCollections.map(collection => <Scatter key={collection.term} name={`Description term: ${collection.term}`} data={collection.orgs} fill={collection.color} shape="circle" />)}
            </ScatterChart>
        </ResponsiveContainer>
    );
}