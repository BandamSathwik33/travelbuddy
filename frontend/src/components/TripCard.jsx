import React from 'react';
import { MapPin, Calendar, IndianRupee, Users, Tag, Edit3, Trash2, Receipt, Sparkles } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import { formatCurrency } from '../utils/currency';

export default function TripCard({ trip, onEdit, onDelete, onManageExpenses, onViewItinerary, onNavigateToTrip }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-paper rounded-3xl overflow-hidden transition-all duration-300 border border-subtle hover:-translate-y-1 hover:shadow-soft flex flex-col justify-between group">
      
      {/* Top Image / Illustration Header */}
      <div className="h-32 relative bg-cream cursor-pointer" onClick={() => onNavigateToTrip && onNavigateToTrip(trip)}>
        <img src={heroBg} alt="Trip background" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-brown shadow-sm backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
           </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <h3 
            className="text-[22px] leading-tight font-medium text-charcoal group-hover:text-brown transition-colors cursor-pointer"
            onClick={() => onNavigateToTrip && onNavigateToTrip(trip)}
          >
            {trip.name}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(trip)}
              className="p-1.5 text-muted hover:text-brown hover:bg-cream rounded-full transition-all"
              title="Edit Trip"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(trip._id)}
              className="p-1.5 text-muted hover:text-terracotta hover:bg-terracotta/10 rounded-full transition-all"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 py-4 border-y border-subtle my-2 text-sm text-charcoal flex-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted shrink-0" />
            <span className="font-medium text-charcoal/80">
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-olive shrink-0" />
              <span className="font-semibold text-charcoal">
                {formatCurrency(trip.budget)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal text-xs bg-cream px-3 py-1.5 rounded-full font-medium border border-subtle">
              <Users className="w-3.5 h-3.5 text-brown" />
              <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
          </div>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {trip.interests.slice(0,3).map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-cream text-muted font-medium border border-subtle/50"
              >
                <Tag className="w-3 h-3 text-brown/60" />
                {interest}
              </span>
            ))}
            {trip.interests.length > 3 && (
               <span className="inline-flex items-center text-xs px-2 py-1 text-muted font-medium">+{trip.interests.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-2 flex justify-between items-center gap-2 text-xs">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => onViewItinerary(trip)}
            className="flex-1 flex justify-center items-center gap-1.5 text-brown font-semibold hover:text-white bg-brown/10 hover:bg-brown px-3 py-2.5 rounded-full transition-all text-[13px]"
            title="AI Itinerary"
          >
            <Sparkles className="w-3.5 h-3.5" /> Itinerary
          </button>
          <button
            onClick={() => onManageExpenses(trip)}
            className="flex-1 flex justify-center items-center gap-1.5 text-charcoal font-semibold hover:bg-olive/10 bg-cream border border-subtle px-3 py-2.5 rounded-full transition-all text-[13px]"
            title="Manage Expenses"
          >
            <Receipt className="w-3.5 h-3.5 text-olive" /> Expenses
          </button>
        </div>
      </div>
    </div>
  );
}
