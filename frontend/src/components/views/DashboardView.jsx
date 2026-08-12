import React from 'react';
import { Globe, DollarSign, Users, AlertCircle } from 'lucide-react';
import TripCard from '../TripCard';
import heroBg from '../../assets/hero-bg.png';
import { formatCurrency } from '../../utils/currency';

export default function DashboardView({
  user,
  trips,
  totalBudget,
  totalTravelers,
  loading,
  error,
  fetchTrips,
  handleOpenCreateModal,
  handleOpenEditModal,
  handleDeleteTrip,
  handleManageExpenses,
  handleViewItinerary,
  onNavigateToTrip
}) {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="mb-12 text-center md:text-left relative">
        <h2 className="text-[36px] md:text-[44px] font-display font-medium tracking-tight mb-2 text-charcoal">
          Good morning, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-xl text-muted">Ready to plan your next adventure?</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft transition-transform hover:-translate-y-1 hover:shadow-float">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-brown/10 rounded-full text-brown">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">Total Trips</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{trips.length}</h3>
        </div>

        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft transition-transform hover:-translate-y-1 hover:shadow-float">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-olive/10 rounded-full text-olive">
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">Total Budget</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{formatCurrency(totalBudget)}</h3>
        </div>

        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft transition-transform hover:-translate-y-1 hover:shadow-float">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-terracotta/10 rounded-full text-terracotta">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">Total Travelers</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">{totalTravelers}</h3>
        </div>

        <div className="bg-paper rounded-3xl p-6 flex flex-col justify-center border border-subtle shadow-soft transition-transform hover:-translate-y-1 hover:shadow-float">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-charcoal/5 rounded-full text-charcoal">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted font-semibold uppercase tracking-widest">Upcoming Trips</p>
          </div>
          <h3 className="text-[40px] font-medium text-charcoal leading-none">
            {trips.filter(t => new Date(t.startDate) >= new Date()).length}
          </h3>
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-display font-medium text-charcoal tracking-tight">Your Upcoming Adventures</h2>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 p-4 bg-terracotta/10 text-terracotta rounded-2xl flex items-center gap-3 border border-terracotta/20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1 text-sm font-medium">{error}</div>
          <button onClick={fetchTrips} className="text-xs font-bold uppercase tracking-wider hover:underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-paper rounded-3xl p-6 h-[340px] animate-pulse border border-subtle">
              <div className="h-32 bg-cream rounded-xl mb-4 w-full"></div>
              <div className="space-y-4">
                <div className="h-6 bg-cream rounded-full w-2/3"></div>
                <div className="h-4 bg-cream rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        /* Empty State */
        <div className="relative bg-paper rounded-[40px] overflow-hidden border border-subtle shadow-soft my-8">
           <img src={heroBg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply pointer-events-none" alt=""/>
           <div className="relative z-10 p-16 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-cream border border-subtle text-brown rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-display font-medium text-charcoal mb-4">No adventures yet.</h3>
            <p className="text-lg text-charcoal/80 mb-8 max-w-md">
              Your next journey starts here. Tell our AI where you want to go.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="bg-terracotta hover:bg-brown text-paper font-semibold text-[15px] uppercase tracking-wider px-8 py-4 rounded-full transition-all active:scale-95 shadow-soft"
            >
              + Create Trip
            </button>
          </div>
        </div>
      ) : (
        /* Trip Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTrip}
              onManageExpenses={handleManageExpenses}
              onViewItinerary={handleViewItinerary}
              onNavigateToTrip={onNavigateToTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
