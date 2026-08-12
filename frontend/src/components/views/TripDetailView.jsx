import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, IndianRupee, Users, Tag, Edit3, Trash2, Map } from 'lucide-react';
import heroBg from '../../assets/hero-bg.png';
import ExpenseModal from '../ExpenseModal';
import ItineraryModal from '../ItineraryModal';
import ItineraryMap from '../ItineraryMap';
import { formatCurrency } from '../../utils/currency';

export default function TripDetailView({ trip, onBack, handleEditTrip, handleDeleteTrip }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // We'll reuse the modals as views by controlling their state internally or just rendering them inline 
  // since the prompt asked for tabs. But to not break existing API fetching inside those modals,
  // we can either render the Modals or extract their inner logic. 
  // For simplicity and safety (not breaking API), we can trigger the modals or wrap them.
  // Actually, since the prompt asks for tabs, let's use the Modals' content if possible, 
  // or just open the modals when clicking the tab, or better yet:
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);

  if (!trip) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="py-4 animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted hover:text-charcoal transition-colors mb-6 font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Trips
      </button>

      {/* Hero Section */}
      <div className="relative w-full h-[320px] rounded-[40px] overflow-hidden mb-8 shadow-soft border border-subtle">
        <img src={heroBg} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60 bg-cream" alt="Trip Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-4 shadow-sm border border-white/30">
              <MapPin className="w-3.5 h-3.5" />
              {trip.destination}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-2">{trip.name}</h1>
            <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {trip.travelers} Travelers</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleEditTrip(trip)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-[13px] transition-all"
            >
              Edit Trip
            </button>
            <button 
              onClick={() => handleDeleteTrip(trip._id)}
              className="bg-terracotta hover:bg-brown text-paper border border-transparent px-6 py-3 rounded-full font-semibold uppercase tracking-wider text-[13px] transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 hide-scrollbar border-b border-subtle">
        {['overview', 'itinerary', 'expenses', 'map'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-semibold uppercase tracking-wider text-sm transition-all border-b-2 ${activeTab === tab ? 'text-brown border-brown' : 'text-muted border-transparent hover:text-charcoal'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-paper rounded-4xl border border-subtle shadow-soft p-8 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-display font-medium text-charcoal mb-4">Trip Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cream p-6 rounded-3xl border border-subtle">
                   <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Budget</p>
                   <p className="text-2xl font-medium text-charcoal flex items-center gap-2">
                     <IndianRupee className="text-olive w-6 h-6" /> {formatCurrency(trip.budget)}
                   </p>
                </div>
                <div className="bg-cream p-6 rounded-3xl border border-subtle">
                   <p className="text-sm font-semibold text-muted uppercase tracking-wider mb-1">Travelers</p>
                   <p className="text-2xl font-medium text-charcoal flex items-center gap-2">
                     <Users className="text-brown w-6 h-6" /> {trip.travelers}
                   </p>
                </div>
              </div>
            </div>

            {trip.interests && trip.interests.length > 0 && (
              <div>
                <h3 className="text-xl font-display font-medium text-charcoal mb-4">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {trip.interests.map((interest, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream text-charcoal font-medium border border-subtle">
                      <Tag className="w-3.5 h-3.5 text-terracotta" /> {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-6 border-t border-subtle">
               <p className="text-muted text-sm">Created on {new Date(trip.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="flex flex-col items-center justify-center text-center py-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="w-20 h-20 bg-brown/10 text-brown rounded-full flex items-center justify-center mb-6">
               <Map className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-display font-medium text-charcoal mb-4">Your personalized itinerary</h3>
             <p className="text-muted max-w-md mx-auto mb-8">AI-generated schedule tailored to your interests and budget.</p>
             <button 
               onClick={() => setIsItineraryModalOpen(true)}
               className="bg-charcoal hover:bg-brown text-paper px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all shadow-soft active:scale-95"
             >
               View / Generate Itinerary
             </button>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="flex flex-col items-center justify-center text-center py-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="w-20 h-20 bg-olive/10 text-olive rounded-full flex items-center justify-center mb-6">
               <IndianRupee className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-display font-medium text-charcoal mb-4">Track your spending</h3>
             <p className="text-muted max-w-md mx-auto mb-8">Keep your budget in check by recording all your trip expenses.</p>
             <button 
               onClick={() => setIsExpenseModalOpen(true)}
               className="bg-charcoal hover:bg-brown text-paper px-8 py-4 rounded-full font-semibold uppercase tracking-wider text-sm transition-all shadow-soft active:scale-95"
             >
               Manage Expenses
             </button>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="h-[400px] bg-cream rounded-3xl border border-subtle overflow-hidden relative animate-in slide-in-from-bottom-4 duration-500">
             <ItineraryMap itinerary={null} destination={trip.destination} />
          </div>
        )}
      </div>

      {/* Keep using the modals for the complex state/API logic of expenses and itinerary to avoid breaking existing backend integration */}
      <ExpenseModal 
        isOpen={isExpenseModalOpen} 
        onClose={() => setIsExpenseModalOpen(false)} 
        trip={trip} 
      />
      <ItineraryModal 
        isOpen={isItineraryModalOpen} 
        onClose={() => setIsItineraryModalOpen(false)} 
        trip={trip} 
      />
    </div>
  );
}
