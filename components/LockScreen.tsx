import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface LockScreenProps {
  type: 'email' | 'phone';
  toolName: string;
  onUnlock: (value: string) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ type, toolName, onUnlock }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'email') return; // Handled by Google Button

    if (!value.trim()) {
      setError('This field is required');
      return;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) {
      setError('Please enter a valid phone number (min 10 digits)');
      return;
    }

    onUnlock(value);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user && user.email) {
        onUnlock(user.email);
      }
    } catch (err: any) {
      console.error("Google Sign In Error:", err);
      if (err.code === 'auth/invalid-api-key') {
        setError('Configuration Error: Invalid Firebase API Key. Please update services/firebase.ts');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full animate-fade-in">
      <div className="w-full max-w-md p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-sm border border-gray-100 text-[#5D5FEF]">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock {toolName}</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          {type === 'email' 
            ? 'Sign in to access advanced analytics and save your reports.'
            : 'Enter your phone number to access payment & pricing simulation tools.'}
        </p>

        {type === 'email' ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-700 font-medium py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm active:transform active:scale-[0.98]"
            >
              {loading ? (
                 <span className="w-5 h-5 border-2 border-gray-400 border-t-[#5D5FEF] rounded-full animate-spin"></span>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                placeholder="+91 98765 43210"
                className={`block w-full rounded-lg border bg-white text-gray-900 py-3 px-4 focus:ring-1 focus:outline-none transition-all shadow-sm ${
                  error 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' 
                    : 'border-gray-200 focus:border-[#5D5FEF] focus:ring-[#5D5FEF]'
                }`}
              />
              {error && <p className="mt-2 text-xs text-rose-500 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#5D5FEF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#4b4dcf] transition-all shadow-lg shadow-[#5D5FEF]/20 active:transform active:scale-[0.98]"
            >
              Unlock Access
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure & Private
        </div>
      </div>
    </div>
  );
};