import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../mockFirebase';
import { Sparkles, Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (auth.getCurrentUser()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await auth.signUp(email, password, name);
      } else {
        await auth.signIn(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await auth.signIn('alex.mercer@university.edu', 'password123');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08060f] relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-950/10 blur-[130px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-950/10 blur-[130px]"></div>

      {/* Main Card */}
      <div className="w-full max-w-md glass-panel border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
            <Sparkles className="h-6 w-6 text-white animate-float" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              {isSignUp ? 'Create your Pilot Account' : 'Welcome Back Student'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {isSignUp ? 'Sign up to start tracking & learning with AI' : 'Sign in to access your dashboard and study tools'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-950/30 border border-red-500/30 text-red-300 rounded-xl flex items-start gap-2.5 text-xs mb-6 animate-shake">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-300" htmlFor="name">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-300" htmlFor="password">Password</label>
              {!isSignUp && (
                <a href="#" className="text-[10px] text-violet-400 hover:text-violet-300 font-medium">Forgot Password?</a>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition mt-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* OR divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-800/80"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Or Quick Demo</span>
          <div className="flex-grow border-t border-gray-800/80"></div>
        </div>

        {/* Demo Fast Login */}
        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl border border-dashed border-violet-500/30 hover:border-violet-500/60 bg-violet-950/10 hover:bg-violet-950/20 text-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span>Launch Immediate Demo Account</span>
        </button>

        {/* Toggle link */}
        <div className="text-center mt-6 text-xs text-gray-400">
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account yet?"}</span>{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-violet-400 hover:text-violet-300 font-semibold transition"
          >
            {isSignUp ? 'Sign In here' : 'Sign Up for free'}
          </button>
        </div>
      </div>
    </div>
  );
}
