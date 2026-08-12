import React from 'react';
import { MapPin, Calendar, DollarSign, Users, Tag, Edit3, Trash2, Receipt, Sparkles } from 'lucide-react';

export default function TripCard({ trip, onEdit, onDelete, onManageExpenses, onViewItinerary }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-[32px] p-6 transition-all duration-300 border border-black/5 hover:border-black/10 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-wandor-muted mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
            </span>
            <h3 className="text-[24px] leading-tight font-semibold text-black group-hover:text-wandor-prompt transition-colors">
              {trip.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-black/5 p-1 rounded-full border border-black/5">
            <button
              onClick={() => onEdit(trip)}
              className="p-2 text-wandor-muted hover:text-black hover:bg-white rounded-full transition-all shadow-sm"
              title="Edit Trip"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(trip._id)}
              className="p-2 text-wandor-muted hover:text-rose-500 hover:bg-white rounded-full transition-all shadow-sm"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3 py-4 border-y border-black/5 my-4 text-sm text-wandor-text">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-wandor-muted shrink-0" />
            <span className="font-medium">
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-wandor-prompt shrink-0" />
              <span className="font-semibold text-black">
                ${trip.budget?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-wandor-muted text-xs bg-black/5 px-3 py-1.5 rounded-full font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
          </div>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {trip.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-black/5 text-wandor-muted font-medium"
              >
                <Tag className="w-3 h-3 text-black/40" />
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-center gap-2 text-xs text-wandor-muted">
        <span className="shrink-0 font-medium">Created {formatDate(trip.createdAt)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewItinerary(trip)}
            className="flex items-center gap-1.5 text-wandor-prompt font-semibold hover:text-white bg-wandor-prompt/10 hover:bg-wandor-prompt px-3 py-2 rounded-full transition-all text-xs"
            title="AI Itinerary"
          >
            <Sparkles className="w-3.5 h-3.5" /> Itinerary
          </button>
          <button
            onClick={() => onManageExpenses(trip)}
            className="flex items-center gap-1.5 text-black font-semibold hover:bg-black/10 bg-black/5 px-3 py-2 rounded-full transition-all text-xs"
            title="Manage Expenses"
          >
            <Receipt className="w-3.5 h-3.5" /> Expenses
          </button>
        </div>
      </div>
    </div>
  );
}
