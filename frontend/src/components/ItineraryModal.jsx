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
    <div className={`bg-white border ${colorTheme.ring} rounded-2xl overflow-hidden transition-all shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-black/10`}>
      {/* Day Header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-black/[0.02] transition-colors"
      >
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm border ${colorTheme.badge}`}>
          D{day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-semibold text-black truncate">{title || `Day ${day}`}</p>
          <p className="text-[13px] text-wandor-muted mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {estimatedDayBudget > 0 && (
            <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
              ~${estimatedDayBudget}
            </span>
          )}
          {open ? <ChevronUp className="w-5 h-5 text-black/40" /> : <ChevronDown className="w-5 h-5 text-black/40" />}
        </div>
      </button>

      {/* Day Body — collapsible */}
      {open && (
        <div className="px-5 pb-6 space-y-6 border-t border-black/5">

          {/* Activities */}
          {activities.length > 0 && (
            <div className="pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-wandor-muted mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Activities
              </p>
              <div className="space-y-4">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${colorTheme.dot}`} />
                      {i < activities.length - 1 && <div className="w-px flex-1 bg-black/5 mt-1.5" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {act.time && (
                            <span className="text-[12px] font-semibold text-wandor-muted mr-3">{act.time}</span>
                          )}
                          <span className="text-[15px] font-medium text-black">{act.activity}</span>
                          {act.description && (
                            <p className="text-[13px] text-wandor-muted mt-1.5 leading-relaxed">{act.description}</p>
                          )}
                        </div>
                        {act.estimatedCost > 0 && (
                          <span className="shrink-0 text-[12px] font-semibold text-black bg-black/5 px-2.5 py-1 rounded-full border border-black/5">
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
            <div className="bg-black/[0.02] rounded-2xl p-4 border border-black/5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-wandor-muted mb-4 flex items-center gap-2">
                <Utensils className="w-3.5 h-3.5" /> Meals
              </p>
              <div className="space-y-3">
                {meals.breakfast && (
                  <div className="flex items-start gap-3">
                    <Coffee className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-semibold text-wandor-muted uppercase tracking-wider">Breakfast </span>
                      <span className="text-[13px] text-black font-medium">{meals.breakfast}</span>
                    </div>
                  </div>
                )}
                {meals.lunch && (
                  <div className="flex items-start gap-3">
                    <Sun className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-semibold text-wandor-muted uppercase tracking-wider">Lunch </span>
                      <span className="text-[13px] text-black font-medium">{meals.lunch}</span>
                    </div>
                  </div>
                )}
                {meals.dinner && (
                  <div className="flex items-start gap-3">
                    <Moon className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-semibold text-wandor-muted uppercase tracking-wider">Dinner </span>
                      <span className="text-[13px] text-black font-medium">{meals.dinner}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {accommodation && (
            <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-2xl p-4">
              <Hotel className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-1">Stay</p>
                <p className="text-[13px] font-medium text-black">{accommodation}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[1400px] h-[92vh] bg-white border border-black/5 rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-black/5 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/5 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-wandor-prompt" />
            </div>
            <div>
              <h2 className="text-[24px] font-semibold text-black tracking-tight leading-tight flex items-center gap-3">
                AI Itinerary
                <span className="text-[11px] font-bold tracking-widest uppercase bg-wandor-prompt/10 text-wandor-prompt px-2.5 py-1 rounded-full border border-wandor-prompt/20">
                  GPT-4o-mini
                </span>
              </h2>
              <p className="text-wandor-muted text-[14px] mt-1">{trip.name} &bull; {trip.destination}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-wandor-muted hover:text-black p-3 rounded-full hover:bg-black/5 transition-colors ml-4 shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Trip Summary Strip */}
        <div className="px-8 py-4 bg-black/[0.02] border-b border-black/5 flex flex-wrap items-center gap-x-6 gap-y-2 shrink-0">
          <span className="flex items-center gap-2 text-[13px] font-medium text-black">
            <MapPin className="w-4 h-4 text-wandor-muted" />{trip.destination}
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-black">
            <Calendar className="w-4 h-4 text-wandor-muted" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-black">
            <DollarSign className="w-4 h-4 text-wandor-prompt" />${trip.budget?.toLocaleString()} budget
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-black">
            <Users className="w-4 h-4 text-wandor-muted" />{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
          </span>
          {trip.interests?.length > 0 && (
            <span className="flex items-center gap-2 text-[13px] font-medium text-black">
              <Tag className="w-4 h-4 text-wandor-muted" />{trip.interests.join(', ')}
            </span>
          )}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main List Pane */}
          <div className="flex-1 overflow-y-auto">

          {/* Error Banner */}
          {error && (
            <div className="m-6 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 text-red-600 shadow-sm">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[16px] font-semibold">Generation failed</p>
                <p className="text-[14px] opacity-80 mt-1">{error}</p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="shrink-0 text-[13px] font-medium bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full transition-colors uppercase tracking-[0.04em]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state (fetching saved itinerary) */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-wandor-muted">
              <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin mb-6" />
              <p className="text-[15px] font-medium">Loading itinerary...</p>
            </div>
          )}

          {/* Generating state (calling OpenAI) */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-[5px] border-black/5 rounded-full" />
                <div className="absolute inset-0 border-[5px] border-t-black rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-black animate-pulse" />
              </div>
              <p className="text-[20px] font-semibold text-black mb-2 tracking-tight">AI is crafting your itinerary...</p>
              <p className="text-[15px] text-wandor-muted">This may take 10–30 seconds</p>
            </div>
          )}

          {/* Empty state — no itinerary yet */}
          {!loading && !generating && !itinerary && !error && (
            <div className="flex flex-col items-center justify-center h-full py-14 px-8 text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-[24px] font-semibold text-black mb-3 tracking-tight">Generate Your AI Itinerary</h3>
              <p className="text-[16px] text-wandor-muted mb-8 leading-relaxed">
                Let GPT-4o-mini plan a personalized day-by-day itinerary based on your destination, dates, budget, and interests.
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center justify-center gap-2.5 w-full bg-black hover:bg-[#333] text-white font-medium px-8 py-4 rounded-full shadow-lg shadow-black/10 transition-all text-[15px] uppercase tracking-[0.04em] active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Itinerary
              </button>
            </div>
          )}

          {/* Itinerary view */}
          {!loading && !generating && itinerary && (
            <div className="p-8 space-y-4">
              {/* Meta strip */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[18px] font-semibold text-black tracking-tight">
                    {itinerary.days?.length}-Day Itinerary
                  </p>
                  <p className="text-[13px] text-wandor-muted mt-1 font-medium">
                    Generated {new Date(itinerary.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {totalBudgetEstimate > 0 && (
                      <span className="ml-4 text-emerald-600 font-semibold">
                        Est. total: ${totalBudgetEstimate.toLocaleString()}/person
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 text-[12px] font-medium text-black hover:bg-black/5 bg-transparent border border-black/10 px-4 py-2.5 rounded-full transition-all uppercase tracking-[0.04em]"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
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
            <div className="hidden md:block w-[45%] border-l border-black/5 bg-black/[0.02] shrink-0 relative">
              <ItineraryMap days={itinerary.days} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
