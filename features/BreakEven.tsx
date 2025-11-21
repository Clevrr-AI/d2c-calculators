import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceDot } from 'recharts';
import { NumberInput, KPICard } from '../components/Common';
import { GeminiInsight } from '../components/GeminiInsight';
import { BreakEvenData } from '../types';

export const BreakEven: React.FC = () => {
  const [inputs, setInputs] = useState<BreakEvenData>({
    fixedCosts: 100000,
    avgSellingPrice: 1500,
    avgVariableCost: 800,
  });

  const [result, setResult] = useState({ units: 0, revenue: 0 });

  useEffect(() => {
    const contributionPerUnit = inputs.avgSellingPrice - inputs.avgVariableCost;
    const breakEvenUnits = contributionPerUnit > 0 ? inputs.fixedCosts / contributionPerUnit : 0;
    const breakEvenRevenue = breakEvenUnits * inputs.avgSellingPrice;

    setResult({
      units: Math.ceil(breakEvenUnits),
      revenue: breakEvenRevenue
    });
  }, [inputs]);

  const chartData = useMemo(() => {
    if(result.units === 0 && inputs.avgSellingPrice <= inputs.avgVariableCost) return [];
    
    const dataPoints = [];
    const maxUnits = result.units === 0 ? 100 : Math.max(100, result.units * 2);
    const step = maxUnits / 20;

    for (let i = 0; i <= maxUnits; i += step) {
      const units = Math.round(i);
      const fixedCost = inputs.fixedCosts;
      const totalRevenue = units * inputs.avgSellingPrice;
      const totalVariableCost = units * inputs.avgVariableCost;
      const totalCost = fixedCost + totalVariableCost;

      dataPoints.push({
        units,
        Revenue: totalRevenue,
        TotalCost: totalCost,
        FixedCost: fixedCost
      });
    }
    return dataPoints;
  }, [inputs, result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 h-fit">
        <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Monthly Fixed Costs</h2>
        <NumberInput label="Total Fixed Costs" value={inputs.fixedCosts} prefix="₹" helpText="Rent, Salaries, Software, etc." onChange={v => setInputs({...inputs, fixedCosts: v})} />
        <NumberInput label="Avg Selling Price" value={inputs.avgSellingPrice} prefix="₹" onChange={v => setInputs({...inputs, avgSellingPrice: v})} />
        <NumberInput label="Variable Cost Per Unit" value={inputs.avgVariableCost} prefix="₹" helpText="COGS + Ship + CPA" onChange={v => setInputs({...inputs, avgVariableCost: v})} />
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard 
            title="Break-Even Units" 
            value={result.units > 0 ? result.units.toLocaleString() : "N/A"} 
            subtext="Units to sell per month"
          />
          <KPICard 
            title="Break-Even Revenue" 
            value={result.revenue > 0 ? `₹${result.revenue.toLocaleString()}` : "N/A"} 
            subtext="Monthly revenue goal"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-6">Projection</h3>
          <div className="h-80 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{top: 5, right: 20, left: 20, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="units" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `₹${val}`} tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    formatter={(val: number) => `₹${val.toLocaleString()}`}
                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: 'none'}} 
                  />
                  <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                  <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="TotalCost" stroke="#000000" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="FixedCost" stroke="#e5e5e5" strokeDasharray="5 5" dot={false} />
                  {result.units > 0 && (
                    <ReferenceDot x={result.units} y={result.revenue} r={4} fill="#ffffff" stroke="#000" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Inputs result in negative margin.
                </div>
            )}
          </div>
        </div>
        <GeminiInsight context="break even analysis" data={{inputs, result}} />
      </div>
    </div>
  );
};