import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import heroBg from '../assets/hero-bg.png'; // Assuming it's a png

export default function Hero({ onLoginClick }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-cream flex flex-col justify-center items-center">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Travel background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 mix-blend-multiply"
      />

      {/* Top Gradient Overlay for Navigation */}
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(247,241,230,0.8) 0%, rgba(247,241,230,0) 100%)'
        }}
      />

      {/* Bottom Gradient Overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-[400px] pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(0deg, rgba(247,241,230,1) 0%, rgba(247,241,230,0) 100%)'
        }}
      />

      {/* Content Wrapper */}
      <div className="relative z-[2] max-w-[1360px] mx-auto w-full px-6 flex-1 flex flex-col justify-center items-center mt-[-64px]">
        {/* Hero Body */}
        <div className="flex flex-col items-center text-center">
          <h1 className="font-sans text-[clamp(44px,6vw,72px)] font-medium text-charcoal leading-[1.05] tracking-[-0.04em] max-w-[820px] mb-6 drop-shadow-sm">
            Where will you go next?
          </h1>
          <p className="font-sans text-xl font-medium text-charcoal/80 leading-relaxed max-w-[540px] mb-12 drop-shadow-sm">
            Tell our AI where you're going and what you love. We'll create a personalized itinerary for you.
          </p>

          {/* Premium Paper Prompt Card */}
          <div className="relative w-full max-w-[calc(100vw-48px)] md:w-[700px] min-h-[220px] bg-paper/90 border border-subtle rounded-4xl shadow-float overflow-hidden backdrop-blur-xl mx-auto flex flex-col justify-center transition-transform hover:scale-[1.01] duration-300">
            
            <p className="w-[calc(100%-48px)] md:w-[500px] font-sans text-lg md:text-xl font-medium text-brown leading-relaxed break-words text-left ml-8 md:ml-10 mt-6 mb-16">
              I'm planning a 7-day trip to Japan in October. I love food, hidden cafes, scenic hikes, and want to avoid crowds...
            </p>

            <button
              onClick={onLoginClick}
              className="absolute bottom-6 right-6 px-8 h-14 bg-terracotta border-none rounded-full shadow-soft cursor-pointer flex items-center justify-center font-sans text-base font-semibold text-paper uppercase tracking-wider transition-all hover:bg-brown active:scale-95"
            >
              Plan My Trip
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
            />
            
            <button
              onClick={handleUploadClick}
              aria-label="Upload inspiration"
              className="absolute left-8 bottom-6 w-12 h-12 bg-cream border border-subtle rounded-full cursor-pointer flex items-center justify-center shadow-sm transition-transform hover:scale-105"
            >
              <Upload className="w-5 h-5 text-brown flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
