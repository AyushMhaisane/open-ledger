import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Loader2, 
  Mail, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isMagicLink, setIsMagicLink] = useState(false); // Toggle between modes
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isMagicLink) {
        // BACKUP METHOD: Magic Link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        setSuccess(true);
      } else {
        // PRIMARY METHOD: Password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard'); // Direct redirect
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Success view for Magic Link
  if (success) {
    return (
      /* ... Keep your existing Success UI code here ... */
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
         {/* Copy the Success UI from previous step, it was perfect */}
         <div className="max-w-md w-full text-center space-y-6">
            <h2 className="text-3xl font-bold">Check your inbox</h2>
            <p>Magic link sent to {email}</p>
            <button onClick={() => setSuccess(false)} className="text-indigo-600">Back</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative transition-all duration-300">
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500">
              {isMagicLink 
                ? "We'll email you a magic link for password-free sign in." 
                : "Enter your password to access your dashboard."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-400 transition-all"
                  placeholder="name@company.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                </div>
              </div>
            </div>

            {/* PASSWORD INPUT (Only if NOT Magic Link) */}
            {!isMagicLink && (
              <div className="animate-fade-in-up">
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <button 
                    type="button"
                    onClick={() => setIsMagicLink(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none hover:border-indigo-400 transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isMagicLink ? "Send Magic Link" : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* TOGGLE MODE */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMagicLink(!isMagicLink)}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
            >
              {isMagicLink ? (
                <>
                  <Lock className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  Sign in with Password
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  Sign in with Magic Link
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
             <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* RIGHT SIDE (Keep your existing branding panel here) */}
      <div className="hidden lg:block relative lg:w-[45%] xl:w-[40%] bg-slate-900 shadow-2xl z-10">
         {/* ... Your nice testimonial code ... */}
      </div>
    </div>
  );
}