import React from 'react';
import { LogOut, Plus, RefreshCw, User as UserIcon, Menu } from 'lucide-react';

export default function Navigation({ 
  user, 
  loading, 
  currentView, 
  onNavigate, 
  onLogin, 
  onLogout, 
  onRefresh, 
  onCreateTrip 
}) {
  return (
    <header className="pt-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="max-w-[1360px] mx-auto h-16 flex items-center justify-between px-6 bg-paper/80 backdrop-blur-xl border border-subtle rounded-full shadow-soft transition-all">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <h1 className="text-[28px] font-display font-medium text-charcoal tracking-tight leading-none select-none">
            TripSync
          </h1>
        </div>

        {/* Center Links (Desktop only) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-8 items-center">
          {user ? (
            <>
              <button 
                onClick={() => onNavigate('discover')}
                className={`bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal ${currentView === 'discover' ? 'text-charcoal' : 'text-muted'}`}
              >
                Discover
              </button>
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal ${currentView === 'dashboard' ? 'text-charcoal' : 'text-muted'}`}
              >
                My Trips
              </button>
              <button 
                onClick={() => onNavigate('expenses')}
                className={`bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal ${currentView === 'expenses' ? 'text-charcoal' : 'text-muted'}`}
              >
                Expenses
              </button>
            </>
          ) : (
            <>
              <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal text-muted">
                Discover
              </button>
              <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal text-muted">
                Pricing
              </button>
              <button className="bg-transparent border-none cursor-pointer text-[14px] font-medium uppercase tracking-[0.04em] transition-all hover:text-charcoal text-muted">
                FAQs
              </button>
            </>
          )}
        </div>

        {/* Right Links */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={onLogin}
                className="hidden md:block bg-transparent border-none cursor-pointer font-sans text-[14px] font-semibold uppercase text-charcoal tracking-[0.04em] transition-opacity hover:opacity-55"
              >
                Login
              </button>
              <button
                onClick={onLogin}
                className="bg-charcoal text-paper border-none cursor-pointer font-sans text-[13px] font-medium uppercase tracking-[0.04em] px-5 py-3 rounded-full transition-all hover:bg-brown active:scale-95 flex items-center gap-1.5 shadow-md shadow-black/10"
              >
                Plan My Trip
              </button>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-subtle bg-black/5">
                <div className="w-6 h-6 rounded-full bg-olive text-white flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <p className="text-xs font-semibold text-charcoal leading-tight pr-2">{user.name}</p>
              </div>

              <button
                onClick={onRefresh}
                className="p-2 text-muted hover:text-charcoal transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-muted hover:text-terracotta transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <button
                onClick={onCreateTrip}
                className="bg-charcoal text-paper border-none cursor-pointer font-sans text-[13px] font-medium uppercase tracking-[0.04em] px-4 py-2.5 rounded-full transition-all hover:bg-brown active:scale-95 flex items-center gap-1.5 shadow-md shadow-black/10"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Trip</span>
              </button>
            </>
          )}

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-charcoal">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
