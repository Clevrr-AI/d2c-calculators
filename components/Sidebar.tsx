import React from 'react';
import { NavItem, ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

const navItems: NavItem[] = [
  { id: ToolType.UNIT_ECONOMICS, label: 'Unit Economics', icon: '📊', description: 'Profitability per unit' },
  { id: ToolType.MARKETING_BUDGET, label: 'Marketing Budget', icon: '📢', description: 'Ad spend & ROAS' },
  { id: ToolType.BREAK_EVEN, label: 'Break Even', icon: '⚖️', description: 'Zero-profit point' },
  { id: ToolType.INVENTORY, label: 'Inventory', icon: '📦', description: 'Stockout planner' },
  { id: ToolType.PAYMENT_GATEWAY, label: 'Gateway Fees', icon: '💳', description: 'Net settlements' },
  { id: ToolType.PRODUCT_PRICING, label: 'Pricing', icon: '🏷️', description: 'Margin calculator' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onNavigate }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 z-30">
        <div className="p-6 pb-4 flex items-center gap-3">
           {/* Logo Placeholder */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20">
              <img src="https://getclevrr.com/favicon.ico" alt="Favicon" />
          </div>
          <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
              Clevrr<br/>Calculators
              </h1>
              <p className="text-[10px] text-[#5D5FEF] font-medium mt-0.5">by Clevrr AI</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 hide-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 group ${
                activeTool === item.id 
                  ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/30' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#5D5FEF]'
              }`}
            >
              <div className={`mr-3 ${activeTool === item.id ? 'grayscale-0' : 'grayscale opacity-70 group-hover:grayscale-0'}`}>{item.icon}</div>
              <div>
                  <div className="text-sm font-medium leading-none">{item.label}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#5D5FEF]/10 flex items-center justify-center text-[#5D5FEF]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L14.5 9L22 12L14.5 15L12 22L9.5 15L2 12L9.5 9L12 2Z" />
                  </svg>
              </div>
              <div>
                  <p className="text-xs font-semibold text-gray-900">Gemini 3 Pro</p>
                  <p className="text-[10px] text-[#5D5FEF] font-medium">Analysis Enabled</p>
              </div>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 z-50 px-2 py-3 flex items-center justify-between overflow-x-auto hide-scrollbar">
        {navItems.map((item) => (
            <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[3.5rem] transition-all duration-200 ${
                activeTool === item.id 
                ? 'bg-[#5D5FEF] text-white shadow-md shadow-[#5D5FEF]/20' 
                : 'text-gray-400 hover:text-[#5D5FEF]'
            }`}
            >
            <span className="text-xl leading-none">{item.icon}</span>
            </button>
        ))}
      </nav>
    </>
  );
};