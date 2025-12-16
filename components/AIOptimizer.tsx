import React, { useState } from 'react';
import { generateOptimization } from '../services/geminiService';
import { saveOptimization } from '../services/tracking';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface AIOptimizerProps {
  context: string;
  currentData: any;
  onApply: (newData: any) => void;
  userEmail: string | null;
}

export const AIOptimizer: React.FC<AIOptimizerProps> = ({ context, currentData, onApply, userEmail }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFix = async () => {
    if (!userEmail) {
      try {
        await signInWithPopup(auth, googleProvider);
        return;
      } catch (error) {
        console.error("Login failed", error);
        return;
      }
    }

    setLoading(true);
    setIsOpen(true);
    
    const optimizationResult = await generateOptimization(context, currentData);
    
    if (optimizationResult) {
      setResult(optimizationResult);
      saveOptimization(
        userEmail, 
        context, 
        currentData, 
        optimizationResult.optimizedData, 
        optimizationResult.explanation
      );
    } else {
      setIsOpen(false); // Close if failed
      alert("AI could not generate a fix at this time. Please try again.");
    }
    
    setLoading(false);
  };

  const applyChanges = () => {
    if (result && result.optimizedData) {
      onApply(result.optimizedData);
      setIsOpen(false);
      setResult(null);
    }
  };

  // Helper to format keys for display
  const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  if (!isOpen && !loading) {
    return (
      <button
        onClick={handleFix}
        className="text-xs font-bold text-[#5D5FEF] bg-[#5D5FEF]/10 px-3 py-1.5 rounded-lg border border-[#5D5FEF]/20 hover:bg-[#5D5FEF] hover:text-white transition-all flex items-center gap-2 animate-pulse-slow"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Fix Numbers for Me
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#5D5FEF] p-6 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            CFO Optimizer
          </h3>
          <p className="text-white/80 text-sm mt-1">
            {loading ? "Analyzing your inputs..." : "Here is a better scenario for your business."}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-[#5D5FEF]/20 border-t-[#5D5FEF] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm animate-pulse">Running Monte Carlo Simulations...</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                 <h4 className="text-emerald-800 font-bold text-sm mb-1 uppercase tracking-wide">Projected Impact</h4>
                 <p className="text-emerald-900 text-sm font-medium leading-relaxed">{result.impact}</p>
              </div>

              <div className="space-y-3">
                 <h4 className="text-gray-400 font-bold text-xs uppercase tracking-wide mb-2">Key Adjustments</h4>
                 <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                    {Object.keys(result.optimizedData).map((key) => {
                        const oldVal = currentData[key];
                        const newVal = result.optimizedData[key];
                        
                        // Only show changed numbers
                        if (oldVal === newVal || typeof oldVal !== 'number') return null;

                        const isImprovement = newVal > oldVal; // Context dependent, but generally distinct style
                        return (
                            <div key={key} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
                                <span className="text-xs font-medium text-gray-600 uppercase">{formatKey(key)}</span>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-gray-400 line-through decoration-rose-400">{oldVal.toLocaleString()}</span>
                                    <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    <span className="font-bold text-[#5D5FEF]">{newVal.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                 </div>
              </div>

              <div>
                <h4 className="text-gray-400 font-bold text-xs uppercase tracking-wide mb-2">Strategy</h4>
                <p className="text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#5D5FEF] pl-4">
                    "{result.explanation}"
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Something went wrong.</div>
          )}
        </div>

        {/* Footer */}
        {!loading && (
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
            <button
                onClick={() => { setIsOpen(false); setResult(null); }}
                className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={applyChanges}
                className="flex-1 py-2.5 px-4 bg-[#5D5FEF] text-white font-bold rounded-xl hover:bg-[#4b4dcf] shadow-lg shadow-[#5D5FEF]/20 transition-all transform active:scale-[0.98]"
            >
                Apply New Numbers
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
