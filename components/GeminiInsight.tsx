import React, { useState } from 'react';
import { generateFinancialInsight } from '../services/geminiService';
import Markdown from 'react-markdown';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { saveInsight } from '../services/tracking';

interface GeminiInsightProps {
  context: string;
  data: any;
  userEmail: string | null;
}

export const GeminiInsight: React.FC<GeminiInsightProps> = ({ context, data, userEmail }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoginError(null);

    // If not logged in, prompt for Google Sign In
    if (!userEmail) {
      try {
        await signInWithPopup(auth, googleProvider);
        // Once logged in, the userEmail prop will update (via parent re-render). 
        // We let the user click again or they can see the button state change.
        return; 
      } catch (error) {
        console.error("Login failed", error);
        setLoginError("Sign-in failed. Please try again.");
        return;
      }
    }

    setLoading(true);
    const result = await generateFinancialInsight(context, data);
    setInsight(result);
    saveInsight(userEmail, context, data, result);
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
            className="px-4 py-2 bg-[#5D5FEF] text-white text-xs font-medium rounded-lg hover:bg-[#4b4dcf] disabled:opacity-50 transition-all shadow-sm shadow-[#5D5FEF]/20 flex items-center gap-2"
          >
            {!userEmail && !loading && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {loading ? 'Analyzing...' : 'Generate Insights' }
          </button>
        )}
      </div>
      
      {loginError && (
        <div className="mb-4 bg-rose-50 text-rose-600 text-xs p-3 rounded-lg border border-rose-100">
            {loginError}
        </div>
      )}

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
        <div className="prose prose-sm prose-p:text-gray-600 prose-headings:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-600 marker:text-gray-400 max-w-none">
            <Markdown>{insight}</Markdown>
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
            {userEmail 
              ? "Use Gemini 3 Pro to analyze your current simulation parameters." 
              : "Sign in to unlock AI-powered strategic recommendations for your brand."}
        </p>
      )}
    </div>
  );
};