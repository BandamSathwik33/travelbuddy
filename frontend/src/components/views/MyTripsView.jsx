import React from 'react';
import TripCard from '../TripCard';
import heroBg from '../../assets/hero-bg.png';
import { Globe } from 'lucide-react';

export default function MyTripsView({
  trips,
  handleOpenCreateModal,
  handleOpenEditModal,
  handleDeleteTrip,
  handleManageExpenses,
  handleViewItinerary,
  onNavigateToTrip
}) {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-[36px] md:text-[44px] font-display font-medium tracking-tight mb-2 text-charcoal">
            My Trips
          </h2>
          <p className="text-xl text-muted">Plan, manage and customize your adventures.</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-terracotta hover:bg-brown text-paper font-semibold text-[14px] uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-soft shrink-0"
        >
          + Create Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="relative bg-paper rounded-[40px] overflow-hidden border border-subtle shadow-soft my-8">
           <img src={heroBg} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply pointer-events-none" alt=""/>
           <div className="relative z-10 p-16 text-center max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-cream border border-subtle text-brown rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Globe className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-display font-medium text-charcoal mb-4">No trips yet.</h3>
            <p className="text-lg text-charcoal/80 mb-8 max-w-md">
              Your next journey starts here.
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
