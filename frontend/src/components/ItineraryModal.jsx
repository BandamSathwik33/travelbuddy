import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Sparkles, RefreshCw, AlertCircle, MapPin, Calendar,
  DollarSign, Users, Tag, Clock, Utensils, Hotel,
  Plane, Car, ShoppingBag, Zap, HelpCircle, ChevronDown,
  ChevronUp, Coffee, Moon, Sun
} from 'lucide-react';
import { itineraryApi } from '../api/api';
import ItineraryMap from './ItineraryMap';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Colour theme for each day (cycling)
const DAY_COLORS = [
  { ring: 'border-indigo-500/40', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-500' },
  { ring: 'border-violet-500/40', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-500' },
  { ring: 'border-sky-500/40',    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',         dot: 'bg-sky-500' },
  { ring: 'border-emerald-500/40',badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',dot: 'bg-emerald-500' },
  { ring: 'border-amber-500/40',  badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',   dot: 'bg-amber-500' },
  { ring: 'border-rose-500/40',   badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',      dot: 'bg-rose-500' },
  { ring: 'border-teal-500/40',   badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',      dot: 'bg-teal-500' },
];

function DayCard({ dayData, colorTheme, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const { day, date, title, activities = [], meals = {}, accommodation, estimatedDayBudget } = dayData;

  return (
    <div className={`bg-slate-950/50 border ${colorTheme.ring} rounded-2xl overflow-hidden transition-all`}>
      {/* Day Header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border ${colorTheme.badge}`}>
          D{day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{title || `Day ${day}`}</p>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {estimatedDayBudget > 0 && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              ~${estimatedDayBudget}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Day Body — collapsible */}
      {open && (
        <div className="px-4 pb-5 space-y-5 border-t border-slate-800/60">

          {/* Activities */}
          {activities.length > 0 && (
            <div className="pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Activities
              </p>
              <div className="space-y-3">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${colorTheme.dot}`} />
                      {i < activities.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {act.time && (
                            <span className="text-[10px] font-semibold text-slate-500 mr-2">{act.time}</span>
                          )}
                          <span className="text-sm font-semibold text-white">{act.activity}</span>
                          {act.description && (
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{act.description}</p>
                          )}
                        </div>
                        {act.estimatedCost > 0 && (
                          <span className="shrink-0 text-xs font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/50">
                            ${act.estimatedCost}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          {(meals.breakfast || meals.lunch || meals.dinner) && (
            <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/60">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                <Utensils className="w-3 h-3" /> Meals
              </p>
              <div className="space-y-2">
                {meals.breakfast && (
                  <div className="flex items-start gap-2">
                    <Coffee className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Breakfast </span>
                      <span className="text-xs text-slate-300">{meals.breakfast}</span>
                    </div>
                  </div>
                )}
                {meals.lunch && (
                  <div className="flex items-start gap-2">
                    <Sun className="w-3.5 h-3.5 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Lunch </span>
                      <span className="text-xs text-slate-300">{meals.lunch}</span>
                    </div>
                  </div>
                )}
                {meals.dinner && (
                  <div className="flex items-start gap-2">
                    <Moon className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Dinner </span>
                      <span className="text-xs text-slate-300">{meals.dinner}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {accommodation && (
            <div className="flex items-start gap-2.5 bg-violet-950/20 border border-violet-500/20 rounded-xl p-3">
              <Hotel className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Stay</p>
                <p className="text-xs text-slate-300">{accommodation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ItineraryModal({ isOpen, onClose, trip }) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);      // fetching existing
  const [generating, setGenerating] = useState(false); // calling OpenAI
  const [error, setError] = useState('');

  const fetchExisting = useCallback(async () => {
    if (!trip?._id) return;
    setLoading(true);
    setError('');
    try {
      const res = await itineraryApi.getItinerary(trip._id);
      setItinerary(res.data || null); // null means not generated yet
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load itinerary');
    } finally {
      setLoading(false);
    }
  }, [trip?._id]);

  useEffect(() => {
    if (isOpen && trip?._id) {
      fetchExisting();
      setError('');
    }
  }, [isOpen, trip?._id, fetchExisting]);

  if (!isOpen || !trip) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await itineraryApi.generateItinerary(trip._id);
      if (res.success) {
        setItinerary(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to generate itinerary. Please try again.';
      setError(msg);
    } finally {
      setGenerating(false);
    }
  };

  const totalBudgetEstimate = itinerary?.days?.reduce((sum, d) => sum + (d.estimatedDayBudget || 0), 0) ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Itinerary
                <span className="text-[10px] font-bold tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  GPT-4o-mini
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">{trip.name} &bull; {trip.destination}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors ml-4 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trip Summary Strip */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/60 flex flex-wrap items-center gap-x-5 gap-y-1.5 shrink-0">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />{trip.destination}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />${trip.budget?.toLocaleString()} budget
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5 text-indigo-400" />{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
          </span>
          {trip.interests?.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />{trip.interests.join(', ')}
            </span>
          )}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main List Pane */}
          <div className="flex-1 overflow-y-auto">

          {/* Error Banner */}
          {error && (
            <div className="m-5 p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-300">Generation failed</p>
                <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="shrink-0 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state (fetching saved itinerary) */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-sm">Loading itinerary...</p>
            </div>
          )}

          {/* Generating state (calling OpenAI) */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
              <p className="text-base font-semibold text-white mb-1">AI is crafting your itinerary…</p>
              <p className="text-xs text-slate-500">This may take 10–30 seconds</p>
            </div>
          )}

          {/* Empty state — no itinerary yet */}
          {!loading && !generating && !itinerary && !error && (
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
              <div className="w-16 h-16 bg-indigo-600/15 border border-indigo-500/30 rounded-3xl flex items-center justify-center mb-5">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Generate Your AI Itinerary</h3>
              <p className="text-sm text-slate-400 max-w-xs mb-6 leading-relaxed">
                Let GPT-4o-mini plan a personalized day-by-day itinerary based on your destination, dates, budget, and interests.
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/25 transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Generate AI Itinerary
              </button>
            </div>
          )}

          {/* Itinerary view */}
          {!loading && !generating && itinerary && (
            <div className="p-5 space-y-3">
              {/* Meta strip */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-white">
                    {itinerary.days?.length}-Day Itinerary
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generated {new Date(itinerary.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {totalBudgetEstimate > 0 && (
                      <span className="ml-3 text-emerald-400 font-semibold">
                        Est. total: ${totalBudgetEstimate.toLocaleString()}/person
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-xl transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>
              </div>

              {/* Day Cards */}
              {itinerary.days?.map((dayData, idx) => (
                <DayCard
                  key={dayData.day ?? idx}
                  dayData={dayData}
                  colorTheme={DAY_COLORS[idx % DAY_COLORS.length]}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          )}
          </div>

          {/* Map Pane (Right side) - Only visible when itinerary exists */}
          {!loading && !generating && itinerary && (
            <div className="hidden md:block w-[45%] border-l border-slate-800 p-4 bg-slate-950/30 shrink-0 relative">
              <ItineraryMap days={itinerary.days} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
