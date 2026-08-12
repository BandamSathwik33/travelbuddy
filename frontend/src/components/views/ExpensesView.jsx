import React from 'react';
import { Plus, Receipt, TrendingUp, Calendar, CreditCard, Coffee, Train, Home } from 'lucide-react';
import heroBg from '../../assets/hero-bg.png';
import { formatCurrency } from '../../utils/currency';

export default function ExpensesView({ handleManageExpenses, trips }) {
  // If we had a global expense endpoint we would use it here. 
  // For now, we'll show the premium UI with some demo content 
  // as instructed when global data isn't directly available.

  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[36px] md:text-[44px] font-display font-medium tracking-tight mb-2 text-charcoal">
            Expenses Overview
          </h2>
          <p className="text-xl text-muted">Track and manage your travel expenses.</p>
        </div>
        <button
          onClick={() => {
            // Trigger the expense modal for the first upcoming trip as a fallback, 
            // or show a toast to select a trip first.
            if(trips && trips.length > 0) {
              handleManageExpenses(trips[0]);
            }
          }}
          className="bg-terracotta hover:bg-brown text-paper font-semibold text-[14px] uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-soft shrink-0"
        >
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft hover:shadow-float transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-olive/10 rounded-full text-olive">
              <Receipt className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">Total Spent</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{formatCurrency(1250)}</h3>
        </div>

        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft hover:shadow-float transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-brown/10 rounded-full text-brown">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">This Month</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{formatCurrency(350)}</h3>
        </div>

        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft hover:shadow-float transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-terracotta/10 rounded-full text-terracotta">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">This Trip</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{formatCurrency(900)}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Chart */}
        <div className="lg:col-span-5 bg-paper rounded-4xl border border-subtle p-8 shadow-soft">
          <h3 className="text-xl font-display font-medium text-charcoal mb-8">Expenses by Category</h3>
          
          <div className="space-y-6">
            {/* Custom CSS Bar Chart */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-charcoal flex items-center gap-2"><Train className="w-4 h-4 text-brown"/> Transport</span>
                <span className="font-medium text-muted">{formatCurrency(300)} (45%)</span>
              </div>
              <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-brown rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-charcoal flex items-center gap-2"><Home className="w-4 h-4 text-olive"/> Accommodation</span>
                <span className="font-medium text-muted">{formatCurrency(350)} (35%)</span>
              </div>
              <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-olive rounded-full" style={{ width: '35%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-charcoal flex items-center gap-2"><Coffee className="w-4 h-4 text-terracotta"/> Food</span>
                <span className="font-medium text-muted">{formatCurrency(80)} (15%)</span>
              </div>
              <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-terracotta rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-charcoal flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted"/> Activities</span>
                <span className="font-medium text-muted">{formatCurrency(200)} (5%)</span>
              </div>
              <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-charcoal/50 rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Expenses List */}
        <div className="lg:col-span-7 bg-paper rounded-4xl border border-subtle p-8 shadow-soft">
          <h3 className="text-xl font-display font-medium text-charcoal mb-6">Recent Expenses</h3>
          
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-subtle/50 hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brown/10 text-brown rounded-xl flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Flight Ticket</h4>
                  <p className="text-sm text-muted">Nov 1, 2026 • Transport</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-charcoal">{formatCurrency(300)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-subtle/50 hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-olive/10 text-olive rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Hotel Booking</h4>
                  <p className="text-sm text-muted">Nov 2, 2026 • Accommodation</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-charcoal">{formatCurrency(350)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-subtle/50 hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Dinner</h4>
                  <p className="text-sm text-muted">Nov 2, 2026 • Food</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-charcoal">{formatCurrency(80)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-cream rounded-2xl border border-subtle/50 hover:bg-white transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-charcoal/5 text-charcoal rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal">Temple Entry</h4>
                  <p className="text-sm text-muted">Nov 3, 2026 • Activities</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-charcoal">{formatCurrency(200)}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
