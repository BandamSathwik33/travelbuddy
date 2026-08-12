import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleTabSwitch = (loginTab) => {
    setIsLogin(loginTab);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await onAuthSuccess('login', {
          email: formData.email,
          password: formData.password
        });
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await onAuthSuccess('register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      let errMsg = 'Unable to connect to the server. Please try again.';
      
      if (!err.response) {
        errMsg = 'Unable to connect to the server. Please try again.';
      } else if (err.response.status === 400) {
        const backendMessage = err.response.data?.message;
        const backendErrors = err.response.data?.errors ? err.response.data.errors.join(', ') : null;
        
        if (backendMessage === 'User already exists with this email') {
          errMsg = 'User already exists with this email';
        } else {
          errMsg = backendErrors || backendMessage || 'Invalid request parameters.';
        }
      } else if (err.response.status === 401) {
        errMsg = 'Invalid credentials. Please try again.';
      } else {
        errMsg = err.response.data?.message || 'An unexpected error occurred.';
      }

      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-paper border border-subtle rounded-4xl shadow-float overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-muted hover:text-charcoal p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Illustration Column (Desktop only) */}
        <div className="hidden md:block md:w-5/12 relative bg-cream">
          <img 
            src={heroBg} 
            alt="Travel inspiration" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent flex items-end p-8">
            <h2 className="font-display text-white text-3xl font-medium tracking-tight">TripSync</h2>
          </div>
        </div>

        {/* Right: Form Column */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-paper relative">
          
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-[32px] font-sans font-medium text-charcoal tracking-tight mb-2 leading-tight">
              {isLogin ? 'Welcome Back!' : 'Create Your TripSync Account'}
            </h3>
            <p className="text-muted text-[16px]">
              {isLogin
                ? 'Continue planning your next adventure.'
                : 'Join TripSync to plan and organize collaborative trips.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-2xl flex items-center gap-3 text-terracotta text-sm shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[13px] font-semibold text-charcoal mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 h-14 bg-white border border-subtle rounded-xl text-charcoal placeholder-muted text-[15px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-charcoal mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="user@example.com"
                  className="w-full pl-12 pr-4 h-14 bg-white border border-subtle rounded-xl text-charcoal placeholder-muted text-[15px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-charcoal mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 h-14 bg-white border border-subtle rounded-xl text-charcoal placeholder-muted text-[15px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 bg-terracotta hover:bg-brown disabled:opacity-50 text-paper font-semibold rounded-full shadow-soft text-[15px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                   LOGIN
                </>
              ) : (
                <>
                   CREATE ACCOUNT
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-8 text-center border-t border-subtle pt-6">
            <p className="text-muted text-[15px]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => handleTabSwitch(!isLogin)}
                className="text-brown font-semibold hover:text-terracotta transition-colors uppercase text-sm tracking-wider"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
