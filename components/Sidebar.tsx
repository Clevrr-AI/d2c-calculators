import React from 'react';
import { NavItem, ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

// SVG Icons
const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const ScaleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

const BoxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const CardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
    <path d="M7 7h.01" />
  </svg>
);

const toolsConfig = [
  { 
    id: ToolType.UNIT_ECONOMICS, 
    label: 'Unit Economics', 
    shortLabel: 'Unit Eco', 
    Icon: ChartIcon, 
    description: 'Profitability per unit',
    color: 'text-[#5D5FEF]'
  },
  { 
    id: ToolType.MARKETING_BUDGET, 
    label: 'Marketing Budget', 
    shortLabel: 'Marketing', 
    Icon: MegaphoneIcon, 
    description: 'Ad spend & ROAS',
    color: 'text-pink-500'
  },
  { 
    id: ToolType.BREAK_EVEN, 
    label: 'Break Even', 
    shortLabel: 'Break Even', 
    Icon: ScaleIcon, 
    description: 'Zero-profit point',
    color: 'text-amber-500'
  },
  { 
    id: ToolType.INVENTORY, 
    label: 'Inventory', 
    shortLabel: 'Inventory', 
    Icon: BoxIcon, 
    description: 'Stockout planner',
    color: 'text-orange-700'
  },
  { 
    id: ToolType.PAYMENT_GATEWAY, 
    label: 'Gateway Fees', 
    shortLabel: 'Gateway', 
    Icon: CardIcon, 
    description: 'Net settlements',
    color: 'text-cyan-600'
  },
  { 
    id: ToolType.PRODUCT_PRICING, 
    label: 'Pricing', 
    shortLabel: 'Pricing', 
    Icon: TagIcon, 
    description: 'Margin calculator',
    color: 'text-yellow-500'
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onNavigate }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 z-30">
        <div className="p-6 pb-4 flex items-center gap-3">
           {/* Logo Placeholder */}
          <div className="w-10 h-10 rounded-xl bg-[#5D5FEF] flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
          <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
              Clevrr<br/>Calculators
              </h1>
              <p className="text-[10px] text-[#5D5FEF] font-medium mt-0.5">by Clevrr AI</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 hide-scrollbar">
          {toolsConfig.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 group ${
                activeTool === item.id 
                  ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/30' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#5D5FEF]'
              }`}
            >
              <div className={`mr-3 transition-colors ${activeTool === item.id ? 'text-white' : 'text-gray-400 group-hover:text-[#5D5FEF]'}`}>
                <item.Icon className="w-5 h-5" />
              </div>
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
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 z-50 px-4 py-3 flex items-center justify-between overflow-x-auto hide-scrollbar gap-2">
        {toolsConfig.map((item) => {
            const isActive = activeTool === item.id;
            return (
            <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center min-w-[3.5rem] gap-1 group"
            >
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive 
                    ? 'bg-[#5D5FEF] text-white shadow-md shadow-[#5D5FEF]/20 transform -translate-y-1' 
                    : `bg-transparent ${item.color} opacity-80 group-hover:opacity-100`
                }`}>
                    <item.Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-[#5D5FEF]' : 'text-gray-400'}`}>
                    {item.shortLabel}
                </span>
            </button>
            );
        })}
      </nav>
    </>
  );
};