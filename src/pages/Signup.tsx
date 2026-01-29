import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  User,
  Lock,
} from 'lucide-react';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ Email + Password signup
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     Success Screen
  -------------------------- */
  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-8 ring-indigo-50">
            <Mail className="w-10 h-10 text-indigo-600" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Verify your email
          </h2>

          <p className="text-slate-500 text-lg leading-relaxed">
            We've sent a verification email to <br />
            <span className="font-semibold text-slate-900">{email}</span>
          </p>

          <div className="bg-slate-50 p-5 rounded-xl text-sm text-slate-600 border border-slate-200">
            <p className="font-medium text-slate-900">One last step</p>
            <p className="mt-1">
              Please verify your email to activate your account and access the dashboard.
            </p>
          </div>

          <button
            onClick={() => setSuccess(false)}
            className="text-slate-400 hover:text-slate-600 font-medium text-sm mt-8 transition-colors"
          >
            Entered wrong email? Back to signup
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------
     Signup Form
  -------------------------- */
  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT: FORM */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-xl text-slate-900">
                OpenLedger
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-slate-500">
              Start managing your properties efficiently today.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="John Doe"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="name@company.com"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-300 rounded-xl
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 rounded-xl
                         bg-indigo-600 text-white font-bold hover:bg-indigo-700
                         disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: VISUAL */}
      <div className="hidden lg:flex w-[40%] bg-indigo-900 text-white p-16 flex-col justify-between">
        <div className="text-2xl font-bold">OpenLedger</div>

        <div>
          <p className="text-2xl font-semibold leading-snug mb-4">
            “We switched from Excel to OpenLedger and saved 15 hours a month.”
          </p>
          <div className="flex gap-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <CheckCircle2 key={i} className="w-5 h-5" />
            ))}
          </div>
        </div>

        <div className="flex gap-6 text-sm text-indigo-200">
          <span>Start for free</span>
          <span>No credit card required</span>
        </div>
      </div>
    </div>
  );
}