import React, { useState, useEffect } from 'react';
import { NumberInput, KPICard } from '../components/Common';
import { GeminiInsight } from '../components/GeminiInsight';
import { AIOptimizer } from '../components/AIOptimizer';
import { MarketingData } from '../types';

interface MarketingSimulatorProps {
  userEmail: string | null;
}

export const MarketingSimulator: React.FC<MarketingSimulatorProps> = ({ userEmail }) => {
  const [inputs, setInputs] = useState<MarketingData>({
    targetRevenue: 1000000,
    aov: 2000,
    targetRoas: 4.0,
    cpc: 25.0
  });

  const [results, setResults] = useState<any>({});

  useEffect(() => {
    const budget = inputs.targetRevenue / inputs.targetRoas;
    const conversionsNeeded = inputs.targetRevenue / inputs.aov;
    const clicksNeeded = budget / inputs.cpc;
    const impliedConversionRate = (conversionsNeeded / clicksNeeded) * 100;
    const cpa = budget / conversionsNeeded;

    setResults({
      budget,
      conversionsNeeded,
      clicksNeeded,
      impliedConversionRate,
      cpa
    });
  }, [inputs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 h-fit">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-[#5D5FEF] uppercase tracking-wide">Campaign Targets</h2>
            <AIOptimizer 
                context="Marketing Budget & ROAS Planning (Goal: Maximize Efficiency)" 
                currentData={inputs} 
                onApply={setInputs} 
                userEmail={userEmail}
            />
        </div>
        <NumberInput label="Target Revenue" value={inputs.targetRevenue} prefix="₹" onChange={v => setInputs({...inputs, targetRevenue: v})} />
        <NumberInput label="Avg Order Value (AOV)" value={inputs.aov} prefix="₹" onChange={v => setInputs({...inputs, aov: v})} />
        <NumberInput label="Target ROAS" value={inputs.targetRoas} step={0.1} helpText="Return on Ad Spend (e.g. 4.0)" onChange={v => setInputs({...inputs, targetRoas: v})} />
        <NumberInput label="Est. CPC" value={inputs.cpc} prefix="₹" step={0.5} helpText="Cost Per Click" onChange={v => setInputs({...inputs, cpc: v})} />
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard title="Required Ad Budget" value={`₹${results.budget?.toLocaleString(undefined, {maximumFractionDigits: 0})}`} subtext="To hit revenue target" />
          <KPICard title="Target CPA" value={`₹${results.cpa?.toFixed(0)}`} subtext="Max cost per acquisition" />
        </div>
        
        <div className="bg-white p-8 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
             <div className="py-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Clicks Needed</p>
                <p className="text-3xl font-light text-black mt-2">{Math.round(results.clicksNeeded || 0).toLocaleString()}</p>
             </div>
             <div className="py-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Orders Needed</p>
                <p className="text-3xl font-light text-black mt-2">{Math.round(results.conversionsNeeded || 0).toLocaleString()}</p>
             </div>
             <div className="py-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Req. Conv. Rate</p>
                <p className={`text-3xl font-light mt-2 ${results.impliedConversionRate > 5 ? 'text-rose-500' : 'text-black'}`}>
                    {results.impliedConversionRate?.toFixed(2)}%
                </p>
                {results.impliedConversionRate > 5 && <p className="text-xs text-rose-500 mt-1">Hard to achieve</p>}
             </div>
        </div>

        <GeminiInsight context="marketing budget planning" data={{inputs, results}} userEmail={userEmail} />
      </div>
    </div>
  );
};