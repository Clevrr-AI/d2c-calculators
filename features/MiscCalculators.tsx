import React, { useState } from 'react';
import { NumberInput, KPICard } from '../components/Common';

export const InventoryCalculator: React.FC = () => {
  const [dailySales, setDailySales] = useState(20);
  const [stock, setStock] = useState(500);
  const [leadTime, setLeadTime] = useState(15);

  const daysLeft = stock / dailySales;
  const stockoutDate = new Date();
  stockoutDate.setDate(stockoutDate.getDate() + daysLeft);
  const reorderPoint = dailySales * leadTime;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Stock Inputs</h2>
        <NumberInput label="Current Stock Level" value={stock} onChange={setStock} />
        <NumberInput label="Avg Daily Sales" value={dailySales} onChange={setDailySales} />
        <NumberInput label="Supplier Lead Time (Days)" value={leadTime} onChange={setLeadTime} />
      </div>
      <div className="space-y-4">
        <KPICard 
          title="Days Until Stockout" 
          value={daysLeft.toFixed(0)} 
          trend={daysLeft < leadTime ? 'down' : 'neutral'}
          subtext={`Est. Stockout: ${stockoutDate.toLocaleDateString()}`}
        />
        <div className={`p-6 rounded-xl border ${stock <= reorderPoint ? 'bg-red-50 border-red-100 text-red-900' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
            <h3 className="font-semibold text-sm mb-2 uppercase tracking-wide">{stock <= reorderPoint ? 'Action Required' : 'Status Healthy'}</h3>
            <p className="text-sm font-light">
                {stock <= reorderPoint 
                 ? `Stock is below the reorder point of ${reorderPoint}. Place order immediately to avoid lost revenue.` 
                 : `Buffer is sufficient. Reorder when stock hits ${reorderPoint} units.`}
            </p>
        </div>
      </div>
    </div>
  );
};

export const PaymentGatewayCalculator: React.FC = () => {
  const [txnValue, setTxnValue] = useState(2000);
  const [domesticRate, setDomesticRate] = useState(2.0);
  const [flatFee, setFlatFee] = useState(0); // Usually 0 for Razorpay/Paytm standard

  const fees = (txnValue * (domesticRate/100)) + flatFee;
  const net = txnValue - fees;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Transaction</h2>
        <NumberInput label="Transaction Value" value={txnValue} prefix="₹" onChange={setTxnValue} />
        <NumberInput label="Gateway Rate (GST incl.)" value={domesticRate} suffix="%" step={0.01} onChange={setDomesticRate} />
        <NumberInput label="Flat Fee" value={flatFee} prefix="₹" step={0.5} onChange={setFlatFee} />
      </div>
      <div className="space-y-4">
        <KPICard title="Gateway Charges" value={`₹${fees.toFixed(2)}`} subtext={`${((fees/txnValue)*100).toFixed(2)}% effective`} />
        <KPICard title="Net Settlement" value={`₹${net.toFixed(2)}`} trend="neutral" />
      </div>
    </div>
  );
};

export const PricingSimulator: React.FC = () => {
  const [cost, setCost] = useState(500);
  const [desiredMargin, setDesiredMargin] = useState(65);
  const [competitorPrice, setCompetitorPrice] = useState(1499);

  const suggestedPrice = cost / (1 - (desiredMargin/100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h2 className="text-sm font-bold text-[#5D5FEF] mb-6 uppercase tracking-wide border-b border-gray-100 pb-2">Pricing Strategy</h2>
        <NumberInput label="Product Cost" value={cost} prefix="₹" onChange={setCost} />
        <NumberInput label="Target Gross Margin" value={desiredMargin} suffix="%" onChange={setDesiredMargin} />
        <NumberInput label="Competitor Price" value={competitorPrice} prefix="₹" onChange={setCompetitorPrice} />
      </div>
      <div className="space-y-4">
         <KPICard title="Suggested Retail Price" value={`₹${suggestedPrice.toFixed(0)}`} />
         <div className="bg-white p-6 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Competitor Check</p>
            <div className="flex items-end gap-3 mt-4">
                <div className="text-2xl font-light text-black">
                    {suggestedPrice > competitorPrice ? 'Premium' : 'Value'}
                </div>
                <span className={`text-sm mb-1 font-medium ${suggestedPrice > competitorPrice ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {Math.abs(((suggestedPrice - competitorPrice)/competitorPrice)*100).toFixed(1)}% {suggestedPrice > competitorPrice ? 'Higher' : 'Lower'}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Compared to competitor price of ₹{competitorPrice}</p>
         </div>
      </div>
    </div>
  );
};