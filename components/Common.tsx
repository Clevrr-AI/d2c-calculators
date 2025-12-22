import React, { useState } from 'react';

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

export const ShareWidget: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = "Check out this D2C Unit Economics Calculator by Clevrr AI! 🚀";

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10'
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:text-black hover:bg-black/10'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.98a9.92 9.92 0 0 0 1.332 4.99L2 22l5.143-1.348a9.926 9.926 0 0 0 4.87 1.278h.004c5.505 0 9.988-4.478 9.989-9.98 0-5.5-4.484-9.979-9.994-9.95zM12.016 20.27c-1.638 0-3.243-.44-4.66-1.27l-3.327.872.888-3.24a8.23 8.23 0 0 1-1.258-4.683c0-4.542 3.696-8.239 8.241-8.239 4.546 0 8.24 3.697 8.24 8.24s-3.694 8.24-8.124 8.32zM16.53 14.945c-.247-.123-1.465-.723-1.692-.805-.228-.082-.394-.124-.56.124-.166.247-.642.805-.786.969-.145.165-.29.185-.536.062-.248-.124-1.045-.385-1.99-1.229-.734-.655-1.23-1.465-1.374-1.712-.144-.248-.015-.381.108-.504.111-.11.248-.289.371-.433.124-.144.166-.248.248-.413.082-.165.041-.31-.02-.433-.062-.124-.56-1.34-.766-1.835-.202-.486-.407-.42-.56-.428h-.478c-.166 0-.434.062-.661.31-.227.247-.867.846-.867 2.063 0 1.217.887 2.393 1.01 2.558.124.165 1.745 2.665 4.228 3.737 2.483 1.072 2.483.714 2.937.673.454-.041 1.465-.599 1.671-1.176.206-.578.206-1.073.144-1.176-.062-.104-.227-.165-.475-.289z" />
        </svg>
      ),
      color: 'hover:text-[#25D366] hover:bg-[#25D366]/10'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Share Tool</span>
      <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-400 transition-all duration-200 ${link.color}`}
            title={`Share on ${link.name}`}
          >
            {link.icon}
          </a>
        ))}
        <div className="w-px h-4 bg-gray-200 mx-1"></div>
        <button
          onClick={handleCopy}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
            copied 
              ? 'bg-emerald-500 text-white' 
              : 'text-gray-400 hover:text-[#5D5FEF] hover:bg-[#5D5FEF]/10'
          }`}
          title="Copy Link"
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};