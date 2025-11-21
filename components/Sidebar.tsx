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
    <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 pb-4 flex items-center gap-3">
         {/* Logo Placeholder */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/40">
            <img src="https://getclevrr.com/favicon.ico" alt="Favicon" />
        </div>
        <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
            D2C Calculators
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
  );
};