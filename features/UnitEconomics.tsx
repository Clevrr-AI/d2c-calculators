import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { NumberInput, KPICard } from '../components/Common';
import { GeminiInsight } from '../components/GeminiInsight';
import { UnitEconomicsData } from '../types';

// Minimalist muted palette
const COLORS = ['#1a1a1a', '#525252', '#a3a3a3', '#d4d4d4', '#e5e5e5', '#f5f5f5'];

export const UnitEconomics: React.FC = () => {
  const [data, setData] = useState<UnitEconomicsData>({
    sellingPrice: 1500,
    cogs: 450,
    shipping: 80,
    packaging: 40,
    marketingCpa: 400,
    paymentGatewayPercent: 2,
    returnsPercent: 15,
  });

  const [metrics, setMetrics] = useState<any>({});
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  useEffect(() => {
    const gatewayFee = data.sellingPrice * (data.paymentGatewayPercent / 100);
    const returnCostPerSale = (data.sellingPrice * (data.returnsPercent / 100));
    
    const totalVariableCosts = 
      data.cogs + 
      data.shipping + 
      data.packaging + 
      gatewayFee + 
      data.marketingCpa + 
      returnCostPerSale;

    const contributionMargin = data.sellingPrice - totalVariableCosts;
    const marginPercent = (contributionMargin / data.sellingPrice) * 100;

    setMetrics({
      gatewayFee,
      returnCostPerSale,
      totalVariableCosts,
      contributionMargin,
      marginPercent
    });
  }, [data]);

  const chartData = [
    { name: 'COGS', value: data.cogs },
    { name: 'Marketing', value: data.marketingCpa },
    { name: 'Logistics', value: data.shipping + data.packaging },
    { name: 'Fees/Returns', value: metrics.gatewayFee + metrics.returnCostPerSale },
    { name: 'Profit', value: Math.max(0, metrics.contributionMargin) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-4 space-y-1">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Parameters</h2>
            <NumberInput label="Avg Selling Price (ASP)" value={data.sellingPrice} prefix="₹" onChange={v => setData({...data, sellingPrice: v})} />
            <NumberInput label="Cost of Goods (COGS)" value={data.cogs} prefix="₹" onChange={v => setData({...data, cogs: v})} />
            <NumberInput label="Marketing CPA" value={data.marketingCpa} prefix="₹" onChange={v => setData({...data, marketingCpa: v})} />
            <NumberInput label="Shipping Cost" value={data.shipping} prefix="₹" onChange={v => setData({...data, shipping: v})} />
            <NumberInput label="Packaging Cost" value={data.packaging} prefix="₹" onChange={v => setData({...data, packaging: v})} />
            
            <div className="grid grid-cols-2 gap-4">
            <NumberInput label="Gateway Fee" value={data.paymentGatewayPercent} suffix="%" step={0.1} onChange={v => setData({...data, paymentGatewayPercent: v})} />
            <NumberInput label="Return Rate" value={data.returnsPercent} suffix="%" step={0.5} onChange={v => setData({...data, returnsPercent: v})} />
            </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard 
            title="Contribution Margin" 
            value={`₹${metrics.contributionMargin?.toFixed(0)}`} 
            trend={metrics.contributionMargin > 0 ? 'up' : 'down'}
            subtext="Per Unit Sold"
          />
          <KPICard 
            title="Margin %" 
            value={`${metrics.marginPercent?.toFixed(1)}%`} 
            trend={metrics.marginPercent > 25 ? 'up' : 'neutral'}
            subtext="Efficiency"
          />
          <KPICard 
            title="Breakeven ROAS" 
            value={`${(data.sellingPrice / Math.max(1, (data.sellingPrice - (metrics.totalVariableCosts - data.marketingCpa)))).toFixed(2)}x`} 
            subtext="Minimum ROAS"
          />
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cost Breakdown</h3>
                <div className="flex bg-gray-50 p-1 rounded-lg">
                    <button 
                        onClick={() => setChartType('bar')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'bar' ? 'bg-[#5D5FEF] text-white shadow-md' : 'text-gray-500 hover:text-[#5D5FEF]'}`}
                    >
                        Bar
                    </button>
                    <button 
                        onClick={() => setChartType('pie')}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${chartType === 'pie' ? 'bg-[#5D5FEF] text-white shadow-md' : 'text-gray-500 hover:text-[#5D5FEF]'}`}
                    >
                        Pie
                    </button>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                        <BarChart layout="vertical" data={chartData} margin={{top: 0, right: 30, left: 40, bottom: 0}} barSize={24}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                            <XAxis type="number" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                            <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11, fill: '#374151'}} axisLine={false} tickLine={false} />
                            <Tooltip 
                                formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Amount']}
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: 'none'}}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Profit' ? '#10b981' : '#1a1a1a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    ) : (
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Profit' ? '#10b981' : COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => [`₹${value.toFixed(0)}`, 'Amount']}
                                contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: 'none'}}
                            />
                            <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>

        <GeminiInsight context="unit economics" data={{inputs: data, calculated: metrics}} />
      </div>
    </div>
  );
};