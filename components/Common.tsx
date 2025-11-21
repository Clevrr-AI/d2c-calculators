import React from 'react';

interface InputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  helpText?: string;
}

export const NumberInput: React.FC<InputProps> = ({ label, value, onChange, prefix, suffix, step = 1, helpText }) => (
  <div className="mb-5">
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      {prefix && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 text-sm font-medium">{prefix}</span>
        </div>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        className={`block w-full rounded-lg border-gray-200 bg-white text-gray-900 py-2.5 
        ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} 
        focus:border-[#5D5FEF] focus:ring-1 focus:ring-[#5D5FEF] focus:outline-none sm:text-sm transition-all border shadow-sm`}
      />
      {suffix && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 text-sm font-medium">{suffix}</span>
        </div>
      )}
    </div>
    {helpText && <p className="mt-1.5 text-xs text-gray-400 font-light">{helpText}</p>}
  </div>
);

export const KPICard: React.FC<{ title: string; value: string; subtext?: string; trend?: 'up' | 'down' | 'neutral' }> = ({ title, value, subtext, trend }) => {
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-500';
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 hover:border-[#5D5FEF]/30 transition-colors">
      <dt className="truncate text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</dt>
      <dd className={`mt-2 text-3xl font-light tracking-tight text-gray-900`}>
        {value}
      </dd>
      {subtext && (
        <p className={`mt-2 text-xs font-medium flex items-center gap-1 ${trendColor}`}>
           {subtext}
        </p>
      )}
    </div>
  );
};