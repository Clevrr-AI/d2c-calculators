
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { NumberInput, KPICard } from '../components/Common';
import { GeminiInsight } from '../components/GeminiInsight';
import { BreakEvenData } from '../types';

interface BreakEvenProps {
  userEmail: string | null;
}

export const BreakEven: React.FC<BreakEvenProps> = ({ userEmail }) => {
  const [inputs, setInputs] = useState<BreakEvenData>({
    fixedCosts: 150000,
    avgSellingPrice: 2000,
    avgVariableCost: 1200,
    cashInBank: 1000000,
    currentMonthlyRevenue: 300000,
    monthlyGrowthRate: 15,
  });

  const [result, setResult] = useState({ 
    breakEvenUnits: 0, 
    monthsToProfit: -1,
    runwayMonths: 0,
    burnRate: 0 
  });

  useEffect(() => {
    const contributionPerUnit = inputs.avgSellingPrice - inputs.avgVariableCost;
    const breakEvenUnits = contributionPerUnit > 0 ? inputs.fixedCosts / contributionPerUnit : 0;
    
    // Simple current burn calculation
    const currentUnits = inputs.currentMonthlyRevenue / inputs.avgSellingPrice;
    const currentGrossMargin = currentUnits * contributionPerUnit;
    const currentBurn = inputs.fixedCosts - currentGrossMargin;

    // Runway calculation (Linear projection logic handled in chart, this is snapshot)
    const runway = currentBurn > 0 ? inputs.cashInBank / currentBurn : 99; // 99 means infinite/profitable

    setResult({
      breakEvenUnits: Math.ceil(breakEvenUnits),
      monthsToProfit: 0, // Calculated in chart loop
      runwayMonths: Math.max(0, runway),
      burnRate: Math.max(0, currentBurn)
    });
  }, [inputs]);

  const simulationData = useMemo(() => {
    const months = 18;
    const data = [];
    let currentCash = inputs.cashInBank;
    let currentRevenue = inputs.currentMonthlyRevenue;
    let profitMonthFound = false;

    for (let i = 0; i < months; i++) {
      const units = currentRevenue / inputs.avgSellingPrice;
      const variableCosts = units * inputs.avgVariableCost;
      const profit = currentRevenue - variableCosts - inputs.fixedCosts;
      
      currentCash += profit;

      data.push({
        month: `M${i + 1}`,
        CashBalance: Math.max(0, currentCash),
        Profit: profit,
        Revenue: currentRevenue,
        Zero: 0
      });

      if (!profitMonthFound && profit > 0) {
        setResult(prev => ({ ...prev, monthsToProfit: i + 1 }));
        profitMonthFound = true;
      }

      // Grow revenue
      currentRevenue = currentRevenue * (1 + (inputs.monthlyGrowthRate / 100));
    }
    return data;
  }, [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 h-fit">
        <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Financial Inputs</h2>
        <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Unit Economics</h3>
                <NumberInput label="Avg Selling Price" value={inputs.avgSellingPrice} prefix="₹" onChange={v => setInputs({...inputs, avgSellingPrice: v})} />
                <NumberInput label="Variable Cost" value={inputs.avgVariableCost} prefix="₹" helpText="COGS + Ad Spend + Ship" onChange={v => setInputs({...inputs, avgVariableCost: v})} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Burn & Growth</h3>
                <NumberInput label="Monthly Fixed Costs" value={inputs.fixedCosts} prefix="₹" helpText="Salaries, Rent, Retainers" onChange={v => setInputs({...inputs, fixedCosts: v})} />
                <NumberInput label="Cash in Bank" value={inputs.cashInBank} prefix="₹" onChange={v => setInputs({...inputs, cashInBank: v})} />
                <NumberInput label="Current Revenue (Monthly)" value={inputs.currentMonthlyRevenue} prefix="₹" onChange={v => setInputs({...inputs, currentMonthlyRevenue: v})} />
                <NumberInput label="Target Growth Rate" value={inputs.monthlyGrowthRate} suffix="%" step={1} onChange={v => setInputs({...inputs, monthlyGrowthRate: v})} />
            </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard 
            title="Estimated Runway" 
            value={result.runwayMonths > 24 ? "24+ Months" : result.runwayMonths === 99 ? "Profitable" : `${result.runwayMonths.toFixed(1)} Months`}
            trend={result.runwayMonths < 6 ? 'down' : 'up'}
            subtext="Until cash zero"
          />
          <KPICard 
            title="Current Burn Rate" 
            value={result.burnRate === 0 ? "Profitable" : `₹${result.burnRate.toLocaleString()}`} 
            trend={result.burnRate > 0 ? 'down' : 'up'}
            subtext="Monthly cash loss"
          />
          <KPICard 
            title="Time to Profit" 
            value={result.monthsToProfit > 0 ? `${result.monthsToProfit} Months` : result.burnRate === 0 ? "Achieved" : "> 18 Months"}
            subtext="Based on growth rate"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cash Flow Simulation (18 Months)</h3>
             <div className="text-xs font-medium text-gray-500 flex gap-4">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cash Balance</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400"></div> Monthly Profit/Loss</span>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={simulationData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                <defs>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <Tooltip formatter={(val: number) => `₹${Math.round(val).toLocaleString()}`} />
                <ReferenceLine y={0} stroke="#000" strokeOpacity={0.1} />
                <Area type="monotone" dataKey="CashBalance" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" strokeWidth={2} />
                <Area type="monotone" dataKey="Profit" stroke="#f43f5e" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
            </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Simulation assumes constant fixed costs and variable costs scaling linearly with revenue.
          </p>
        </div>
        <GeminiInsight context="startup runway and cash flow" data={{inputs, result, simulationSnapshot: simulationData.slice(0, 6)}} userEmail={userEmail} />
      </div>
    </div>
  );
};
