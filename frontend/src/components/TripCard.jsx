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
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {trip.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onEdit(trip)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-md transition-colors"
              title="Edit Trip"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(trip._id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-md transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 py-3 border-y border-slate-800/80 my-4 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-400">
                ${trip.budget?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800/50 px-2.5 py-1 rounded-md">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
            </div>
          </div>
        </div>

        {trip.interests && trip.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {trip.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                <Tag className="w-3 h-3 text-slate-400" />
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/50 flex justify-between items-center gap-2 text-xs text-slate-500">
        <span className="shrink-0">Created {formatDate(trip.createdAt)}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onViewItinerary(trip)}
            className="flex items-center gap-1.5 text-indigo-400 font-semibold hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-1 rounded-lg transition-all text-xs"
            title="AI Itinerary"
          >
            <Sparkles className="w-3.5 h-3.5" /> Itinerary
          </button>
          <button
            onClick={() => onManageExpenses(trip)}
            className="flex items-center gap-1.5 text-slate-400 font-semibold hover:text-white bg-slate-800/60 hover:bg-slate-700 border border-slate-700/50 px-2.5 py-1 rounded-lg transition-all text-xs"
            title="Manage Expenses"
          >
            <Receipt className="w-3.5 h-3.5" /> Expenses
          </button>
        </div>
      </div>
    </div>
  );
}
