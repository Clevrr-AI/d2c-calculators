import React, { useState } from 'react';
import { NumberInput, KPICard } from '../components/Common';
import { GeminiInsight } from '../components/GeminiInsight';
import { AIOptimizer } from '../components/AIOptimizer';

interface CalculatorProps {
  userEmail: string | null;
}

/* -------------------------------------------------------------------------- */
/*                        1. SMART STOCK & CAPITAL PLANNER                    */
/* -------------------------------------------------------------------------- */

export const InventoryCalculator: React.FC<CalculatorProps> = ({ userEmail }) => {
  const [inputs, setInputs] = useState({
    avgDailySales: 25,
    currentStock: 1200,
    supplierLeadTime: 20, // days
    safetyStockDays: 10,
    unitCost: 450, // Cost to buy from factory
    moq: 500, // Minimum order quantity
  });

  // Logic
  const dailyBurnRate = inputs.avgDailySales * inputs.unitCost; // Capital burn per day on COGS
  const daysOfInventory = inputs.currentStock / inputs.avgDailySales;
  const reorderPointUnits = (inputs.avgDailySales * inputs.supplierLeadTime) + (inputs.avgDailySales * inputs.safetyStockDays);
  
  const status = inputs.currentStock <= reorderPointUnits ? 'CRITICAL' : inputs.currentStock <= (reorderPointUnits * 1.2) ? 'WARNING' : 'HEALTHY';
  
  // Suggested Order
  const suggestedOrderUnits = Math.max(inputs.moq, reorderPointUnits * 2); // Simple heuristic: Order enough for 2 cycles or MOQ
  const capitalRequired = suggestedOrderUnits * inputs.unitCost;
  
  const stockoutDate = new Date();
  stockoutDate.setDate(stockoutDate.getDate() + daysOfInventory);
  
  // Date to reorder to avoid stockout based on lead time
  const reorderDate = new Date();
  const daysUntilReorder = daysOfInventory - inputs.supplierLeadTime - inputs.safetyStockDays;
  reorderDate.setDate(reorderDate.getDate() + daysUntilReorder);

  const insightData = {
    inputs,
    analysis: {
        daysOfInventory,
        status,
        capitalRequired,
        daysUntilReorder
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5 bg-white p-6 rounded-xl border border-gray-100 h-fit">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-[#5D5FEF] uppercase tracking-wide">Supplier & Sales Data</h2>
            <AIOptimizer 
                context="Inventory Planning (Goal: Avoid Stockout & Minimize Tied Capital)" 
                currentData={inputs} 
                onApply={setInputs} 
                userEmail={userEmail}
            />
        </div>
        <NumberInput label="Avg Daily Unit Sales" value={inputs.avgDailySales} onChange={v => setInputs({...inputs, avgDailySales: v})} />
        <NumberInput label="Current Stock (Units)" value={inputs.currentStock} onChange={v => setInputs({...inputs, currentStock: v})} />
        <NumberInput label="Unit Cost (COGS)" value={inputs.unitCost} prefix="₹" onChange={v => setInputs({...inputs, unitCost: v})} />
        
        <div className="grid grid-cols-2 gap-4">
            <NumberInput label="Lead Time (Days)" value={inputs.supplierLeadTime} onChange={v => setInputs({...inputs, supplierLeadTime: v})} />
            <NumberInput label="Safety Stock (Days)" value={inputs.safetyStockDays} onChange={v => setInputs({...inputs, safetyStockDays: v})} />
        </div>
        <NumberInput label="Supplier MOQ" value={inputs.moq} onChange={v => setInputs({...inputs, moq: v})} />
      </div>

      <div className="md:col-span-7 space-y-6">
        <div className="grid grid-cols-2 gap-4">
             <div className={`p-5 rounded-xl border ${status === 'CRITICAL' ? 'bg-rose-50 border-rose-100' : 'bg-gray-50 border-gray-100'}`}>
                <p className={`text-xs font-bold uppercase ${status === 'CRITICAL' ? 'text-rose-600' : 'text-gray-500'}`}>Stock Status</p>
                <p className="text-2xl font-light text-gray-900 mt-2">{Math.round(daysOfInventory)} Days Left</p>
                <p className="text-xs text-gray-500 mt-1">Stockout: {stockoutDate.toLocaleDateString()}</p>
             </div>
             <KPICard title="Reorder Point" value={`${Math.round(reorderPointUnits)} Units`} subtext="Trigger new PO here" />
        </div>

        <div className="bg-[#5D5FEF]/5 border border-[#5D5FEF]/20 p-6 rounded-xl">
            <h3 className="text-[#5D5FEF] font-bold text-sm uppercase tracking-wider mb-4">Capital Planning Requirement</h3>
            <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Target Order Date</span>
                <span className={`font-mono font-medium ${daysUntilReorder < 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                    {daysUntilReorder < 0 ? "IMMEDIATELY" : reorderDate.toLocaleDateString()}
                </span>
            </div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Suggested Quantity</span>
                <span className="font-mono font-medium text-gray-900">{suggestedOrderUnits.toLocaleString()} Units</span>
            </div>
             <div className="h-px bg-[#5D5FEF]/20 my-4"></div>
            <div className="flex items-center justify-between">
                <span className="text-[#5D5FEF] font-bold text-lg">Cash Needed</span>
                <span className="text-3xl font-light text-gray-900">₹{capitalRequired.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-right">Includes MOQ constraint</p>
        </div>

        <GeminiInsight context="inventory and working capital planning" data={insightData} userEmail={userEmail} />
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                    2. COD & RTO PROFIT ANALYZER                            */
/* -------------------------------------------------------------------------- */

export const PaymentGatewayCalculator: React.FC<CalculatorProps> = ({ userEmail }) => {
  const [inputs, setInputs] = useState({
    asp: 1500,
    cogs: 400,
    shippingForward: 80,
    shippingReverse: 120, // Cost if item returns
    codHandlingFee: 40,
    gatewayFeePercent: 2,
    
    prepaidShare: 60, // % of orders that are prepaid
    rtoPrepaid: 5, // % RTO on prepaid
    rtoCod: 30, // % RTO on COD (usually high)
  });

  const codShare = 100 - inputs.prepaidShare;
  
  // 1. Prepaid Unit Economics (Per Order Attempt)
  // Success Rate = 100 - RTO
  // Cost on Success = COGS + ShipFwd + Gateway
  // Cost on RTO = ShipFwd + ShipRev + Gateway (usually charged) + Packaging Loss (ignored for simplicity)
  const prepaidGatewayFee = inputs.asp * (inputs.gatewayFeePercent/100);
  const prepaidSuccessMargin = inputs.asp - inputs.cogs - inputs.shippingForward - prepaidGatewayFee;
  const prepaidFailCost = inputs.shippingForward + inputs.shippingReverse + prepaidGatewayFee;
  const weightedPrepaidProfit = ((100 - inputs.rtoPrepaid)/100 * prepaidSuccessMargin) - ((inputs.rtoPrepaid/100) * prepaidFailCost);

  // 2. COD Unit Economics
  // Cost on Success = COGS + ShipFwd + COD Fee
  // Cost on RTO = ShipFwd + ShipRev
  const codSuccessMargin = inputs.asp - inputs.cogs - inputs.shippingForward - inputs.codHandlingFee;
  const codFailCost = inputs.shippingForward + inputs.shippingReverse;
  const weightedCodProfit = ((100 - inputs.rtoCod)/100 * codSuccessMargin) - ((inputs.rtoCod/100) * codFailCost);

  // 3. Overall Weighted
  const blendedProfit = ((inputs.prepaidShare/100) * weightedPrepaidProfit) + ((codShare/100) * weightedCodProfit);

  const insightData = {
    inputs,
    analysis: {
        weightedPrepaidProfit,
        weightedCodProfit,
        blendedProfit,
        rtoLossImpact: (inputs.asp - inputs.cogs) - blendedProfit
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4 space-y-4">
         <div className="bg-white p-5 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <h2 className="text-sm font-bold text-[#5D5FEF] uppercase tracking-wide">Order Profile</h2>
                <AIOptimizer 
                    context="COD vs Prepaid RTO Optimization (Goal: Maximize Realized Profit)" 
                    currentData={inputs} 
                    onApply={setInputs} 
                    userEmail={userEmail}
                />
            </div>
            <NumberInput label="Avg Selling Price" value={inputs.asp} prefix="₹" onChange={v => setInputs({...inputs, asp: v})} />
            <NumberInput label="Prepaid Share" value={inputs.prepaidShare} suffix="%" onChange={v => setInputs({...inputs, prepaidShare: v})} />
            <div className="mt-2 text-xs text-gray-500">COD Share: {codShare}%</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100">
            <h2 className="text-sm font-bold text-[#5D5FEF] mb-4 uppercase tracking-wide">RTO Costs</h2>
            <div className="grid grid-cols-2 gap-3">
                 <NumberInput label="Prepaid RTO" value={inputs.rtoPrepaid} suffix="%" onChange={v => setInputs({...inputs, rtoPrepaid: v})} />
                 <NumberInput label="COD RTO" value={inputs.rtoCod} suffix="%" onChange={v => setInputs({...inputs, rtoCod: v})} />
            </div>
            <NumberInput label="Forward Shipping" value={inputs.shippingForward} prefix="₹" onChange={v => setInputs({...inputs, shippingForward: v})} />
            <NumberInput label="Reverse Shipping" value={inputs.shippingReverse} prefix="₹" onChange={v => setInputs({...inputs, shippingReverse: v})} />
         </div>
      </div>

      <div className="md:col-span-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
             <KPICard title="True Net Profit" value={`₹${Math.round(blendedProfit)}`} subtext="Weighted Avg / Order" trend={blendedProfit > 0 ? 'up' : 'down'} />
             <KPICard title="RTO Loss Impact" value={`-₹${Math.round((inputs.asp - inputs.cogs) - blendedProfit)}`} subtext="Lost potential per unit" trend="down" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prepaid Card */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                <h3 className="text-emerald-800 font-bold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Prepaid Reality
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-emerald-700">Profit on Success</span>
                        <span className="font-semibold">₹{Math.round(prepaidSuccessMargin)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-rose-600">Loss on RTO</span>
                        <span className="font-semibold text-rose-600">-₹{Math.round(prepaidFailCost)}</span>
                    </div>
                    <div className="pt-3 border-t border-emerald-200 flex justify-between">
                        <span className="font-bold text-emerald-900">Net Value / Order</span>
                        <span className="font-bold text-emerald-900">₹{Math.round(weightedPrepaidProfit)}</span>
                    </div>
                </div>
            </div>

             {/* COD Card */}
             <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl">
                <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    COD Reality
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-orange-700">Profit on Success</span>
                        <span className="font-semibold">₹{Math.round(codSuccessMargin)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-rose-600">Loss on RTO</span>
                        <span className="font-semibold text-rose-600">-₹{Math.round(codFailCost)}</span>
                    </div>
                    <div className="pt-3 border-t border-orange-200 flex justify-between">
                        <span className="font-bold text-orange-900">Net Value / Order</span>
                        <span className="font-bold text-orange-900">₹{Math.round(weightedCodProfit)}</span>
                    </div>
                </div>
            </div>
        </div>

        <GeminiInsight context="COD vs Prepaid profitability analysis" data={insightData} userEmail={userEmail} />
      </div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                     3. OFFER & BUNDLE ARCHITECT                            */
/* -------------------------------------------------------------------------- */

export const PricingSimulator: React.FC<CalculatorProps> = ({ userEmail }) => {
  const [inputs, setInputs] = useState({
    baseCost: 400,
    basePrice: 1500,
    shippingPerOrder: 100, // Fixed cost per order usually
    marketingCpa: 400,
    
    // Bundle Config
    bundleSize: 3,
    bundleDiscount: 20, // % off
  });

  // Single Unit Math
  const singleRevenue = inputs.basePrice;
  const singleCost = inputs.baseCost + inputs.shippingPerOrder + inputs.marketingCpa;
  const singleProfit = singleRevenue - singleCost;
  const singleMargin = (singleProfit / singleRevenue) * 100;

  // Bundle Math
  const bundleRevenue = (inputs.basePrice * inputs.bundleSize) * (1 - (inputs.bundleDiscount/100));
  const bundleCost = (inputs.baseCost * inputs.bundleSize) + inputs.shippingPerOrder + inputs.marketingCpa; 
  // Note: Shipping and CPA often stay flat or increase marginally, huge leverage point
  const bundleProfit = bundleRevenue - bundleCost;
  const bundleMargin = (bundleProfit / bundleRevenue) * 100;

  const insightData = {
    inputs,
    analysis: {
        singleProfit,
        singleMargin,
        bundleProfit,
        bundleMargin,
        profitMultiplier: bundleProfit > 0 ? (bundleProfit/singleProfit) : 0,
        absoluteProfitChange: bundleProfit - singleProfit
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-4 bg-white p-6 rounded-xl border border-gray-100 h-fit">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-[#5D5FEF] uppercase tracking-wide">Product Base</h2>
            <AIOptimizer 
                context="Product Bundle Pricing (Goal: Maximize Total Cash Profit)" 
                currentData={inputs} 
                onApply={setInputs} 
                userEmail={userEmail}
            />
        </div>
        <NumberInput label="Single Unit Cost (COGS)" value={inputs.baseCost} prefix="₹" onChange={v => setInputs({...inputs, baseCost: v})} />
        <NumberInput label="Single Unit Price" value={inputs.basePrice} prefix="₹" onChange={v => setInputs({...inputs, basePrice: v})} />
        <NumberInput label="Shipping Cost (Per Order)" value={inputs.shippingPerOrder} prefix="₹" onChange={v => setInputs({...inputs, shippingPerOrder: v})} />
        <NumberInput label="Marketing CPA (Per Order)" value={inputs.marketingCpa} prefix="₹" onChange={v => setInputs({...inputs, marketingCpa: v})} />

        <div className="mt-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <h3 className="text-indigo-800 font-bold text-xs uppercase mb-3">Bundle Configuration</h3>
             <NumberInput label="Items in Bundle" value={inputs.bundleSize} step={1} onChange={v => setInputs({...inputs, bundleSize: v})} />
             <NumberInput label="Discount %" value={inputs.bundleDiscount} suffix="%" onChange={v => setInputs({...inputs, bundleDiscount: v})} />
        </div>
      </div>

      <div className="md:col-span-8 space-y-6">
         <div className="grid grid-cols-2 gap-0 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Single Unit Column */}
            <div className="bg-white p-6 border-r border-gray-200">
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-6 text-center">Selling 1 Unit</h3>
                <div className="space-y-6 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="text-xl font-medium">₹{singleRevenue}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Profit</p>
                        <p className="text-2xl font-bold text-gray-900">₹{Math.round(singleProfit)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Margin</p>
                        <p className={`text-lg font-medium ${singleMargin < 15 ? 'text-rose-500' : 'text-emerald-600'}`}>
                            {singleMargin.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Bundle Column */}
            <div className="bg-[#5D5FEF]/5 p-6 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#5D5FEF] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg uppercase tracking-wide">
                    Strategy Winner
                 </div>
                <h3 className="text-[#5D5FEF] font-bold text-xs uppercase tracking-wider mb-6 text-center">Selling Bundle ({inputs.bundleSize}x)</h3>
                <div className="space-y-6 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="text-xl font-medium text-[#5D5FEF]">₹{Math.round(bundleRevenue)}</p>
                        <p className="text-[10px] text-gray-400 line-through">₹{inputs.basePrice * inputs.bundleSize}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Profit</p>
                        <p className="text-3xl font-bold text-[#5D5FEF]">₹{Math.round(bundleProfit)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Margin</p>
                        <p className={`text-lg font-medium ${bundleMargin < 15 ? 'text-rose-500' : 'text-emerald-600'}`}>
                            {bundleMargin.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
         </div>
         
         <div className="bg-gray-900 text-white p-6 rounded-xl flex items-center justify-between">
             <div>
                 <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Absolute Profit Impact</p>
                 <p className="text-sm text-gray-300 mt-1">Selling 1 bundle generates the profit of <span className="text-white font-bold">{bundleProfit > 0 ? (bundleProfit/singleProfit).toFixed(1) : 0}</span> single orders.</p>
             </div>
             <div className="text-right">
                 <p className="text-3xl font-light text-emerald-400">
                    +{Math.round(bundleProfit - singleProfit)}
                 </p>
                 <p className="text-[10px] text-gray-400 uppercase">Extra Cash per Order</p>
             </div>
         </div>
         
         <p className="text-xs text-gray-400 leading-relaxed">
            <strong>Pro Tip:</strong> Even if Margin % drops on bundles, the absolute cash profit usually increases significantly because Shipping and CAC (Marketing Cost) often remain flat per order, creating massive operating leverage.
         </p>

         <GeminiInsight context="product bundling and pricing strategy" data={insightData} userEmail={userEmail} />
      </div>
    </div>
  );
};