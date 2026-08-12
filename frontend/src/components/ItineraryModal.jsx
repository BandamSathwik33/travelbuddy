import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Sparkles, RefreshCw, AlertCircle, MapPin, Calendar,
  IndianRupee, Users, Tag, Clock, Utensils, Hotel,
  Plane, Car, ShoppingBag, Zap, HelpCircle, ChevronDown,
  ChevronUp, Coffee, Moon, Sun
} from 'lucide-react';
import { itineraryApi } from '../api/api';
import ItineraryMap from './ItineraryMap';
import { formatCurrency } from '../utils/currency';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Colour theme for each day (cycling)
const DAY_COLORS = [
  { ring: 'border-olive', badge: 'bg-olive/10 text-olive border-olive/30', dot: 'bg-olive' },
  { ring: 'border-brown', badge: 'bg-brown/10 text-brown border-brown/30', dot: 'bg-brown' },
  { ring: 'border-terracotta',    badge: 'bg-terracotta/10 text-terracotta border-terracotta/30',         dot: 'bg-terracotta' },
  { ring: 'border-charcoal',badge: 'bg-charcoal/10 text-charcoal border-charcoal/30',dot: 'bg-charcoal' },
  { ring: 'border-olive/60',  badge: 'bg-olive/5 text-olive/80 border-olive/20',   dot: 'bg-olive/60' },
  { ring: 'border-brown/60',   badge: 'bg-brown/5 text-brown/80 border-brown/20',      dot: 'bg-brown/60' },
  { ring: 'border-terracotta/60',   badge: 'bg-terracotta/5 text-terracotta/80 border-terracotta/20',      dot: 'bg-terracotta/60' },
];

function DayCard({ dayData, colorTheme, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const { day, date, title, activities = [], meals = {}, accommodation, estimatedDayBudget } = dayData;

  return (
    <div className={`bg-paper border ${colorTheme.ring} rounded-3xl overflow-hidden transition-all shadow-sm hover:shadow-soft hover:border-charcoal/20`}>
      {/* Day Header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-6 text-left hover:bg-cream transition-colors"
      >
        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-display font-medium text-lg border ${colorTheme.badge}`}>
          D{day}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[18px] font-display font-medium text-charcoal truncate">{title || `Day ${day}`}</p>
          <p className="text-[14px] text-muted mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {estimatedDayBudget > 0 && (
            <span className="text-[13px] font-semibold text-olive bg-olive/10 border border-olive/20 px-3 py-1.5 rounded-full">
              ~{formatCurrency(estimatedDayBudget)}
            </span>
          )}
          {open ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
        </div>
      </button>

      {/* Day Body — collapsible */}
      {open && (
        <div className="px-6 pb-8 space-y-6 border-t border-subtle">

          {/* Activities */}
          {activities.length > 0 && (
            <div className="pt-6">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Activities
              </p>
              <div className="space-y-5">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${colorTheme.dot} shadow-sm`} />
                      {i < activities.length - 1 && <div className="w-px flex-1 bg-subtle mt-2" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          {act.time && (
                            <span className="text-[13px] font-semibold text-brown/80 mr-3">{act.time}</span>
                          )}
                          <span className="text-[16px] font-medium text-charcoal">{act.activity}</span>
                          {act.description && (
                            <p className="text-[14px] text-muted mt-2 leading-relaxed bg-cream/50 p-3 rounded-xl border border-subtle/50">{act.description}</p>
                          )}
                        </div>
                        {act.estimatedCost > 0 && (
                          <span className="shrink-0 text-[13px] font-semibold text-charcoal bg-cream px-3 py-1.5 rounded-full border border-subtle">
                            {formatCurrency(act.estimatedCost)}
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
            <div className="bg-cream rounded-3xl p-6 border border-subtle">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-muted mb-5 flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Meals
              </p>
              <div className="space-y-4">
                {meals.breakfast && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
                       <Coffee className="w-4 h-4" />
                    </div>
                    <div className="mt-1">
                      <span className="text-[12px] font-semibold text-muted uppercase tracking-widest block mb-0.5">Breakfast </span>
                      <span className="text-[15px] text-charcoal font-medium">{meals.breakfast}</span>
                    </div>
                  </div>
                )}
                {meals.lunch && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-olive/10 text-olive flex items-center justify-center shrink-0">
                       <Sun className="w-4 h-4" />
                    </div>
                    <div className="mt-1">
                      <span className="text-[12px] font-semibold text-muted uppercase tracking-widest block mb-0.5">Lunch </span>
                      <span className="text-[15px] text-charcoal font-medium">{meals.lunch}</span>
                    </div>
                  </div>
                )}
                {meals.dinner && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brown/10 text-brown flex items-center justify-center shrink-0">
                       <Moon className="w-4 h-4" />
                    </div>
                    <div className="mt-1">
                      <span className="text-[12px] font-semibold text-muted uppercase tracking-widest block mb-0.5">Dinner </span>
                      <span className="text-[15px] text-charcoal font-medium">{meals.dinner}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {accommodation && (
            <div className="flex items-center gap-4 bg-olive/5 border border-olive/20 rounded-3xl p-5">
              <div className="w-10 h-10 rounded-full bg-olive/10 text-olive flex items-center justify-center shrink-0">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-olive mb-0.5">Stay</p>
                <p className="text-[15px] font-medium text-charcoal">{accommodation}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[1400px] h-[92vh] bg-paper border border-subtle rounded-4xl shadow-float flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-subtle shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cream border border-subtle flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-7 h-7 text-brown" />
            </div>
            <div>
              <h2 className="text-[28px] font-display font-medium text-charcoal tracking-tight leading-tight flex items-center gap-3">
                AI Itinerary
                <span className="text-[11px] font-bold tracking-widest uppercase bg-brown/10 text-brown px-3 py-1.5 rounded-full border border-brown/20">
                  GPT-4o-mini
                </span>
              </h2>
              <p className="text-muted text-[15px] mt-1">{trip.name} &bull; {trip.destination}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-charcoal p-3 rounded-full hover:bg-cream transition-colors ml-4 shrink-0 border border-transparent hover:border-subtle"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Trip Summary Strip */}
        <div className="px-8 py-5 bg-cream/50 border-b border-subtle flex flex-wrap items-center gap-x-8 gap-y-3 shrink-0">
          <span className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
            <MapPin className="w-4 h-4 text-muted" />{trip.destination}
          </span>
          <span className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
            <Calendar className="w-4 h-4 text-muted" />
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </span>
          <span className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
            <IndianRupee className="w-4 h-4 text-olive" />{formatCurrency(trip.budget)} budget
          </span>
          <span className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
            <Users className="w-4 h-4 text-muted" />{trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
          </span>
          {trip.interests?.length > 0 && (
            <span className="flex items-center gap-2 text-[14px] font-medium text-charcoal">
              <Tag className="w-4 h-4 text-muted" />{trip.interests.join(', ')}
            </span>
          )}
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main List Pane */}
          <div className="flex-1 overflow-y-auto">

          {/* Error Banner */}
          {error && (
            <div className="m-8 p-6 bg-terracotta/10 border border-terracotta/20 rounded-3xl flex items-start gap-4 text-terracotta shadow-sm">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[16px] font-semibold">Generation failed</p>
                <p className="text-[14px] font-medium mt-1">{error}</p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="shrink-0 text-[13px] font-semibold bg-terracotta hover:bg-brown text-paper px-6 py-3 rounded-full transition-colors uppercase tracking-wider shadow-sm"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state (fetching saved itinerary) */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <div className="w-12 h-12 border-4 border-subtle border-t-brown rounded-full animate-spin mb-6" />
              <p className="text-[15px] font-medium uppercase tracking-wider">Loading itinerary...</p>
            </div>
          )}

          {/* Generating state (calling OpenAI) */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-[4px] border-subtle rounded-full" />
                <div className="absolute inset-0 border-[4px] border-t-brown rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-brown animate-pulse" />
              </div>
              <p className="text-[24px] font-display font-medium text-charcoal mb-2 tracking-tight">AI is crafting your itinerary...</p>
              <p className="text-[16px] text-muted">This may take 10–30 seconds. Perfecting every detail.</p>
            </div>
          )}

          {/* Empty state — no itinerary yet */}
          {!loading && !generating && !itinerary && !error && (
            <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center max-w-lg mx-auto">
              <div className="w-24 h-24 bg-cream border border-subtle rounded-full flex items-center justify-center mb-8 shadow-sm">
                <Sparkles className="w-10 h-10 text-brown" />
              </div>
              <h3 className="text-[28px] font-display font-medium text-charcoal mb-4 tracking-tight">Generate Your AI Itinerary</h3>
              <p className="text-[16px] text-muted mb-10 leading-relaxed">
                Let GPT-4o-mini plan a personalized day-by-day itinerary based on your destination, dates, budget, and interests. Beautifully mapped out for you.
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center justify-center gap-3 w-full bg-brown hover:bg-charcoal text-paper font-semibold px-8 py-5 rounded-full shadow-soft transition-all text-[15px] uppercase tracking-wider active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Itinerary
              </button>
            </div>
          )}

          {/* Itinerary view */}
          {!loading && !generating && itinerary && (
            <div className="p-8 space-y-6">
              {/* Meta strip */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[22px] font-display font-medium text-charcoal tracking-tight">
                    {itinerary.days?.length}-Day Itinerary
                  </p>
                  <p className="text-[14px] text-muted mt-1 font-medium">
                    Generated {new Date(itinerary.generatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    {totalBudgetEstimate > 0 && (
                      <span className="ml-4 text-olive font-semibold">
                        Est. total: {formatCurrency(totalBudgetEstimate)}/person
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 text-[13px] font-semibold text-charcoal hover:bg-cream bg-transparent border border-subtle px-6 py-3 rounded-full transition-all uppercase tracking-wider shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
              </div>

              {/* Day Cards */}
              <div className="space-y-6">
                {itinerary.days?.map((dayData, idx) => (
                  <DayCard
                    key={dayData.day ?? idx}
                    dayData={dayData}
                    colorTheme={DAY_COLORS[idx % DAY_COLORS.length]}
                    defaultOpen={idx === 0}
                  />
                ))}
              </div>
            </div>
          )}
          </div>

          {/* Map Pane (Right side) - Only visible when itinerary exists */}
          {!loading && !generating && itinerary && (
            <div className="hidden md:block w-[45%] border-l border-subtle bg-cream/30 shrink-0 relative p-6">
              <div className="w-full h-full rounded-3xl overflow-hidden border border-subtle shadow-inner">
                <ItineraryMap days={itinerary.days} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
