
import React from 'react';
import { NavItem, ToolType } from '../types';

interface SidebarProps {
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
  hasEmail: boolean;
  hasPhone: boolean;
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

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
    label: 'Runway & Cash', 
    shortLabel: 'Runway', 
    Icon: ScaleIcon, 
    description: 'Cash flow simulation',
    color: 'text-amber-500',
    requiresEmail: true
  },
  { 
    id: ToolType.INVENTORY, 
    label: 'Capital Planner', 
    shortLabel: 'Inventory', 
    Icon: BoxIcon, 
    description: 'Stock & working capital',
    color: 'text-orange-700',
    requiresEmail: true
  },
  { 
    id: ToolType.PAYMENT_GATEWAY, 
    label: 'COD & RTO Analyzer', 
    shortLabel: 'RTO & COD', 
    Icon: CardIcon, 
    description: 'Net realization calc',
    color: 'text-cyan-600',
    requiresPhone: true
  },
  { 
    id: ToolType.PRODUCT_PRICING, 
    label: 'Bundle Architect', 
    shortLabel: 'Bundles', 
    Icon: TagIcon, 
    description: 'Offer strategy',
    color: 'text-yellow-500',
    requiresPhone: true
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTool, onNavigate, hasEmail, hasPhone }) => {
  const isLocked = (tool: any) => {
    if (tool.requiresEmail && !hasEmail) return true;
    if (tool.requiresPhone && !hasPhone) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 z-30">
        <div className="p-6 pb-4 flex items-center gap-3">
           {/* Logo Placeholder */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20">
              <img src="https://getclevrr.com/favicon.ico" alt="Logo" />
          </div>
          <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
              Clevrr<br/>Calculators
              </h1>
              <p className="text-[10px] text-[#5D5FEF] font-medium mt-0.5">by <a href="https://getclevrr.com?utm-source=calculator&utm-medium=sidebar&utm-campaign=calculator" target="_blank" rel="noreferrer">Clevrr AI</a> </p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1 hide-scrollbar">
          {toolsConfig.map((item) => {
            const locked = isLocked(item);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                  activeTool === item.id 
                    ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/30' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#5D5FEF]'
                }`}
              >
                <div className={`mr-3 transition-colors ${activeTool === item.id ? 'text-white' : 'text-gray-400 group-hover:text-[#5D5FEF]'}`}>
                  <item.Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-medium leading-none flex items-center justify-between">
                      {item.label}
                      {locked && <LockIcon className={`w-3 h-3 ${activeTool === item.id ? 'text-white/70' : 'text-gray-300'}`} />}
                    </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Clevrr AI CTA */}
        <div className="px-4 mb-2">
            <a 
              href="https://getclevrr.com?utm_source=calculator_app&utm_medium=sidebar_cta&utm_campaign=ai_cofounder" 
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-[#5D5FEF] to-[#4345d1] rounded-2xl p-5 text-white shadow-lg shadow-[#5D5FEF]/25 hover:shadow-xl hover:shadow-[#5D5FEF]/40 transition-all group relative overflow-hidden transform hover:-translate-y-1"
            >
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-colors"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">New</span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight mb-1">Meet Clevrr AI</h3>
                    <p className="text-xs text-white/90 font-medium leading-relaxed mb-4">
                        The AI Co-founder that thinks, talks & acts for your D2C brand.
                    </p>
                    <div className="bg-white text-[#5D5FEF] text-xs font-bold py-2.5 px-4 rounded-lg text-center flex items-center justify-center gap-2 group-hover:bg-gray-50 transition-colors shadow-sm">
                        Get Early Access
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </a>
        </div>

      </aside>

      {/* Mobile Floating Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 z-50 px-4 py-3 flex items-center justify-between overflow-x-auto hide-scrollbar gap-2">
        {toolsConfig.map((item) => {
            const isActive = activeTool === item.id;
            const locked = isLocked(item);
            return (
            <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center min-w-[3.5rem] gap-1 group relative"
            >
                {locked && (
                   <div className="absolute top-1 right-2 bg-white rounded-full p-0.5 shadow-sm">
                      <LockIcon className="w-2.5 h-2.5 text-gray-400" />
                   </div>
                )}
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
