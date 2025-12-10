
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ShareWidget } from './components/Common';
import { LockScreen } from './components/LockScreen';
import { ToolType } from './types';
import { UnitEconomics } from './features/UnitEconomics';
import { BreakEven } from './features/BreakEven';
import { MarketingSimulator } from './features/MarketingSimulator';
import { InventoryCalculator, PaymentGatewayCalculator, PricingSimulator } from './features/MiscCalculators';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { syncUserOnLogin, syncUserPhone } from './services/tracking';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.UNIT_ECONOMICS);
  
  // Auth State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Phone state still uses localStorage as it's a separate "soft lock" for specific tools
  const [userPhone, setUserPhone] = useState<string | null>(() => {
    try {
      return localStorage.getItem('clevrr_user_phone');
    } catch {
      return null;
    }
  });

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        syncUserOnLogin(user);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handler for manual phone unlock
  const handlePhoneUnlock = (phone: string) => {
    setUserPhone(phone);
    localStorage.setItem('clevrr_user_phone', phone);
    syncUserPhone(phone, auth.currentUser);
  };

  // Handler for email unlock (triggered by successful Google Sign In in LockScreen)
  const handleEmailUnlock = (email: string) => {
    setUserEmail(email);
    // syncUserOnLogin is handled by onAuthStateChanged effect
  };

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.UNIT_ECONOMICS: 
        return <UnitEconomics userEmail={userEmail} />;
      case ToolType.MARKETING_BUDGET: 
        return <MarketingSimulator userEmail={userEmail} />;
      case ToolType.BREAK_EVEN: 
        return userEmail 
          ? <BreakEven userEmail={userEmail} /> 
          : <LockScreen type="email" toolName="Break-Even Analysis" onUnlock={handleEmailUnlock} />;
      case ToolType.INVENTORY: 
        return userEmail 
          ? <InventoryCalculator userEmail={userEmail} /> 
          : <LockScreen type="email" toolName="Inventory Planner" onUnlock={handleEmailUnlock} />;
      case ToolType.PAYMENT_GATEWAY: 
        return userPhone 
          ? <PaymentGatewayCalculator userEmail={userEmail} /> 
          : <LockScreen type="phone" toolName="Gateway Fees Calculator" onUnlock={handlePhoneUnlock} />;
      case ToolType.PRODUCT_PRICING: 
        return userPhone 
          ? <PricingSimulator userEmail={userEmail} /> 
          : <LockScreen type="phone" toolName="Pricing Simulator" onUnlock={handlePhoneUnlock} />;
      default: 
        return <UnitEconomics userEmail={userEmail} />;
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
       <header className="md:hidden px-6 pt-6 pb-2 flex items-center justify-between sticky top-0 bg-white z-20">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20 shrink-0">
                <img src="https://getclevrr.com/favicon.ico" alt="Logo" />
            </div>
            <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">Clevrr Calculators</h1>
                <p className="text-[10px] text-[#5D5FEF] font-medium">by Clevrr AI</p>
            </div>
         </div>

         {/* Mobile CTA */}
         <a 
            href="https://getclevrr.com?utm_source=calculator_app&utm_medium=mobile_header_cta&utm_campaign=ai_cofounder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5D5FEF]/10 text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white rounded-lg transition-all border border-[#5D5FEF]/20"
         >
             <span className="text-[10px] font-bold uppercase tracking-wide">Explore Clevrr AI</span>
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
            </svg>
         </a>
      </header>

      <Sidebar 
        activeTool={activeTool} 
        onNavigate={setActiveTool} 
        hasEmail={!!userEmail}
        hasPhone={!!userPhone}
      />
      
      <main className="flex-1 p-6 md:p-12 pb-32 md:pb-12 overflow-y-auto h-[100dvh] md:h-screen">
        <header className="mb-6 md:mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center justify-between w-full">
                <div>
                    <h1 className="text-2xl md:text-3xl font-light text-black tracking-tight">{getToolTitle()}</h1>
                    <p className="text-gray-400 text-sm mt-2 font-light">Adjust parameters to simulate different financial scenarios.</p>
                </div>
                {userEmail && (
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">{userEmail}</span>
                        <button 
                            onClick={() => auth.signOut()}
                            className="text-xs text-[#5D5FEF] hover:underline ml-2"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
            <ShareWidget />
        </header>
        
        <div className="max-w-5xl mx-auto">
            {renderTool()}
        </div>
      </main>
    </div>
  );
};

export default App;