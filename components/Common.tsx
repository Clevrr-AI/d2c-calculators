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
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.031-9.672-.272-.989-.471-1.135-.644-1.135l-1.876.006c-.495.013-.99.026-1.486.571-.496.545-1.907 1.859-1.907 4.535 0 2.677 1.956 5.304 2.228 5.676.273.371 3.81 5.923 9.38 8.23 3.565 1.478 4.293 1.184 5.061 1.111.768-.074 2.476-1.015 2.822-1.994.347-.98.347-1.819.248-1.994z"/>
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