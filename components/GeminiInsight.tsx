import React, { useState } from 'react';
import { generateFinancialInsight } from '../services/geminiService';

interface GeminiInsightProps {
  context: string;
  data: any;
}

export const GeminiInsight: React.FC<GeminiInsightProps> = ({ context, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await generateFinancialInsight(context, data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#5D5FEF] rounded-full"></div>
          AI Strategic Analysis
        </h3>
        {!insight && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-4 py-2 bg-[#5D5FEF] text-white text-xs font-medium rounded-lg hover:bg-[#4b4dcf] disabled:opacity-50 transition-all shadow-sm shadow-[#5D5FEF]/20"
          >
            {loading ? 'Analyzing...' : 'Generate Insights'}
          </button>
        )}
      </div>

      {loading && (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-3 py-1">
            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )}

      {insight && (
        <div className="prose prose-sm prose-p:text-gray-600 prose-headings:text-gray-800 max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{insight}</div>
             <button
                onClick={() => setInsight(null)}
                className="mt-4 text-xs text-gray-400 hover:text-[#5D5FEF] underline transition-colors"
            >
                Refresh Analysis
            </button>
        </div>
      )}
       {!insight && !loading && (
        <p className="text-xs text-gray-400">
            Use Gemini 3 Pro to analyze your current simulation parameters.
        </p>
      )}
    </div>
  );
};