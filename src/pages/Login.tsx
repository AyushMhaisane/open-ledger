import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Loader2, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-green-50">
            <Mail className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Check your inbox</h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            We've sent a secure login link to <br/>
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
          <div className="bg-slate-50 p-5 rounded-xl text-sm text-slate-600 border border-slate-200 shadow-sm">
            <p className="font-medium text-slate-900">Next Steps:</p>
            <p className="mt-1">Click the link in the email to sign in automatically.</p>
            <p className="mt-2 text-slate-400 pt-2 border-t border-slate-200">Didn't receive it? Check your spam folder.</p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline underline-offset-4 flex items-center justify-center gap-2 mx-auto mt-8 transition-all"
          >
            Try a different email
          </button>
        </div>
      </div>
    );
  }

  // LOGIN STATE
  return (
    <div className="min-h-screen bg-white flex">
      
      {/* LEFT SIDE: Login Form (Expanded Width) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative transition-all duration-300">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">OpenLedger</span>
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500">
              Enter your email to access your property dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3 shadow-sm animate-shake">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           hover:border-indigo-400 transition-all shadow-sm group-hover:shadow-md"
                  placeholder="name@company.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                We'll email you a magic link for a password-free sign in.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 
                       text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Sending Link...
                </>
              ) : (
                <>
                  Send Login Link
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-colors">
                Contact Sales
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Visual/Brand (Reduced Width on Large Screens) */}
      <div className="hidden lg:block relative lg:w-[45%] xl:w-[40%] bg-slate-900 shadow-2xl z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(79,70,229,0.1),transparent)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        <div className="relative h-full flex flex-col justify-between p-16 xl:p-20 z-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">OpenLedger</span>
          </div>

          <div className="space-y-8">
            <blockquote className="space-y-6">
              <div className="text-xl xl:text-2xl font-medium leading-relaxed opacity-90">
                "Finally, a property management tool that doesn't feel like it was built in 1999. It's clean, fast, and handles my hostel billing perfectly."
              </div>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-lg ring-4 ring-indigo-500/30">
                  JD
                </div>
                <div>
                  <div className="font-bold text-white">Jayesh D.</div>
                  <div className="text-indigo-200 text-sm">Owner, Metro Student Living</div>
                </div>
              </footer>
            </blockquote>
          </div>

          <div className="flex gap-6 text-sm text-indigo-200/60 font-medium">
            <div className="flex items-center gap-2 hover:text-indigo-200 transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Bank-grade Security
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-200 transition-colors cursor-default">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Open Source
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}