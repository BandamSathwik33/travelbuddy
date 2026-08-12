import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, AlertCircle } from 'lucide-react';

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
      const errMsg = err.response?.data?.message || (err.response?.data?.errors ? err.response.data.errors.join(', ') : 'Authentication failed');
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-black/5 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-wandor-muted hover:text-black p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex border-b border-black/5 bg-black/[0.02] p-3 gap-2">
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-3 text-[14px] font-semibold rounded-full flex items-center justify-center gap-2 transition-all uppercase tracking-[0.04em] ${
              isLogin
                ? 'bg-black text-white shadow-md'
                : 'text-wandor-muted hover:text-black hover:bg-black/5'
            }`}
          >
            <LogIn className="w-4 h-4" /> Log In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-3 text-[14px] font-semibold rounded-full flex items-center justify-center gap-2 transition-all uppercase tracking-[0.04em] ${
              !isLogin
                ? 'bg-black text-white shadow-md'
                : 'text-wandor-muted hover:text-black hover:bg-black/5'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h3 className="text-[28px] font-semibold text-black tracking-tight mb-2 leading-tight">
              {isLogin ? 'Welcome Back' : 'Join TripSync'}
            </h3>
            <p className="text-wandor-muted text-[15px]">
              {isLogin
                ? 'Enter your credentials to access your trips'
                : 'Plan and organize collaborative trips'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 h-14 bg-black/5 border border-transparent rounded-2xl text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="user@example.com"
                  className="w-full pl-12 pr-4 h-14 bg-black/5 border border-transparent rounded-2xl text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-black/40">
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
                  className="w-full pl-12 pr-4 h-14 bg-black/5 border border-transparent rounded-2xl text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-14 bg-wandor-prompt hover:bg-[#7a4827] disabled:opacity-50 text-white font-medium rounded-full shadow-lg shadow-wandor-prompt/20 text-[15px] uppercase tracking-[0.04em] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" /> Log In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
