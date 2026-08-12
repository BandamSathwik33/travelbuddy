import React from 'react';
import { Search, MapPin } from 'lucide-react';
import heroBg from '../../assets/hero-bg.png';

const destinations = [
  {
    name: "Japan",
    description: "Experience culture, nature, food and ancient temples.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Switzerland",
    description: "Mountain lakes, scenic railways and breathtaking landscapes.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Bali",
    description: "Beaches, culture and relaxation.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Turkey",
    description: "History, culture and stunning landscapes.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a088f?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Iceland",
    description: "Northern lights and dramatic natural wonders.",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800&auto=format&fit=crop"
  },
  {
    name: "Thailand",
    description: "Beaches, food and vibrant life.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop"
  }
];

export default function DiscoverView({ handleOpenCreateModal }) {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-[36px] md:text-[44px] font-display font-medium tracking-tight mb-2 text-charcoal">
          Discover Destinations
        </h2>
        <p className="text-xl text-muted">Find your next adventure.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full pl-12 pr-4 h-14 bg-white border border-subtle rounded-2xl text-charcoal placeholder-muted text-[15px] focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="h-14 px-6 bg-white border border-subtle rounded-2xl text-charcoal font-medium whitespace-nowrap hover:border-brown transition-all">
            Budget
          </button>
          <button className="h-14 px-6 bg-white border border-subtle rounded-2xl text-charcoal font-medium whitespace-nowrap hover:border-brown transition-all">
            Duration
          </button>
          <button className="h-14 px-6 bg-white border border-subtle rounded-2xl text-charcoal font-medium whitespace-nowrap hover:border-brown transition-all">
            Travelers
          </button>
          <button className="h-14 px-8 bg-charcoal text-paper border-none rounded-2xl font-semibold uppercase tracking-wider hover:bg-brown transition-all">
            Search
          </button>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest, index) => (
          <div key={index} className="group relative bg-paper rounded-3xl overflow-hidden border border-subtle shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-float flex flex-col h-[400px]">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
            </div>
            
            <div className="relative z-10 mt-auto p-8 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md mb-3">
                <MapPin className="w-3.5 h-3.5" />
                Destination
              </span>
              <h3 className="text-3xl font-medium text-white mb-2 font-display">{dest.name}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6 line-clamp-2">
                {dest.description}
              </p>
              <button 
                onClick={handleOpenCreateModal}
                className="w-full py-3.5 bg-white/10 hover:bg-white text-white hover:text-charcoal border border-white/30 backdrop-blur-md rounded-full font-semibold uppercase tracking-wider text-sm transition-all"
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
