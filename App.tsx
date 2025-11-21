import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ToolType } from './types';
import { UnitEconomics } from './features/UnitEconomics';
import { BreakEven } from './features/BreakEven';
import { MarketingSimulator } from './features/MarketingSimulator';
import { InventoryCalculator, PaymentGatewayCalculator, PricingSimulator } from './features/MiscCalculators';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.UNIT_ECONOMICS);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.UNIT_ECONOMICS: return <UnitEconomics />;
      case ToolType.MARKETING_BUDGET: return <MarketingSimulator />;
      case ToolType.BREAK_EVEN: return <BreakEven />;
      case ToolType.INVENTORY: return <InventoryCalculator />;
      case ToolType.PAYMENT_GATEWAY: return <PaymentGatewayCalculator />;
      case ToolType.PRODUCT_PRICING: return <PricingSimulator />;
      default: return <UnitEconomics />;
    }
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case ToolType.UNIT_ECONOMICS: return "Unit Economics Calculator";
      case ToolType.MARKETING_BUDGET: return "Marketing Budget Simulator";
      case ToolType.BREAK_EVEN: return "Break-Even Analysis";
      case ToolType.INVENTORY: return "Inventory & Stockout Planner";
      case ToolType.PAYMENT_GATEWAY: return "Payment Gateway Fees";
      case ToolType.PRODUCT_PRICING: return "Product Pricing Simulator";
      default: return "Calculator";
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[100dvh] bg-white text-gray-900 font-sans">
       {/* Mobile Header */}
       <header className="md:hidden px-6 pt-6 pb-2 flex items-center gap-3 sticky top-0 bg-white z-20">
         <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20 shrink-0">
             <img src="https://getclevrr.com/favicon.ico" alt="Favicon" />
         </div>
         <div>
             <h1 className="text-base font-bold text-gray-900 leading-tight">Clevrr Calculators</h1>
             <p className="text-[10px] text-[#5D5FEF] font-medium">by Clevrr AI</p>
         </div>
      </header>

      <Sidebar activeTool={activeTool} onNavigate={setActiveTool} />
      
      <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12 overflow-y-auto h-[100dvh] md:h-screen">
        <header className="mb-6 md:mb-10 border-b border-gray-100 pb-6">
            <h1 className="text-2xl md:text-3xl font-light text-black tracking-tight">{getToolTitle()}</h1>
            <p className="text-gray-400 text-sm mt-2 font-light">Adjust parameters to simulate different financial scenarios.</p>
        </header>
        
        <div className="max-w-5xl mx-auto">
            {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;