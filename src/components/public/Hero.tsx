import React from 'react';
import { WEDDING_IMAGES } from '../../data/weddingImages';
import { Calendar, ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroProps {
  onBookNow: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookNow, onExploreServices }) => {
  const { businessSettings } = useApp();

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#ECE5DD]">
      {/* Subtle warm ambient lighting glow behind */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-[#F3E7DC] rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-10 -z-10 w-80 h-80 bg-[#EFE1D5] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-8">
            {/* Elegant kicker */}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C7A6B]">
              <span className="w-6 h-px bg-[#A37E52]" />
              <span>San Francisco &amp; Global Destination Wedding Studio</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1F1D1B] font-normal leading-[1.12] tracking-tight">
              Crafting extraordinary celebrations with{' '}
              <span className="italic font-normal text-[#8A6740] underline decoration-[#E8DFD8] decoration-2 underline-offset-8">
                architectural grace
              </span>{' '}
              and effortless warmth.
            </h1>

            {/* Supporting description */}
            <p className="text-base sm:text-lg text-[#524B45] font-light leading-relaxed max-w-2xl">
              From historic European villas to modern California estates, we orchestrate high-concept wedding designs, rigorous logistical timelines, and bespoke guest experiences tailored exclusively to each couple’s narrative.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={onBookNow}
                className="inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] active:scale-[0.99] rounded-md transition-all shadow-md group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D9C3AC] transition-transform group-hover:scale-110" />
                <span>Reserve Your Planning Consultation</span>
                <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 text-sm font-medium text-[#38332E] hover:text-[#1F1D1B] bg-white/80 hover:bg-white rounded-md border border-[#E0D7CE] hover:border-[#B8A89A] transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Curated Offerings</span>
              </button>
            </div>

            {/* Editorial Trust Markers */}
            <div className="pt-6 border-t border-[#ECE5DD] grid grid-cols-3 gap-6 text-[#4A4540]">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1D1B]">12+</p>
                <p className="text-xs uppercase tracking-wider text-[#8C7A6B] mt-1 font-medium">
                  Years of Studio Artistry
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1D1B]">18</p>
                <p className="text-xs uppercase tracking-wider text-[#8C7A6B] mt-1 font-medium">
                  Exclusive Weddings / Year
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1D1B]">100%</p>
                <p className="text-xs uppercase tracking-wider text-[#8C7A6B] mt-1 font-medium">
                  Bespoke Vendor Curation
                </p>
              </div>
            </div>

          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Wedding Visual with rich framing */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#E4DDD4] aspect-[4/5] bg-[#EFE8E0]">
                <img
                  src={WEDDING_IMAGES.hero.url}
                  alt={WEDDING_IMAGES.hero.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
                
                {/* Subtle gradient vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1D1B]/55 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center space-x-1.5 text-[11px] tracking-widest uppercase text-[#EADFCB] font-medium mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#EADFCB]" />
                    <span>Estate Reception Design</span>
                  </div>
                  <p className="font-serif text-lg text-white font-light leading-snug">
                    Architectural lighting and floral cascade for intimate dinner service
                  </p>
                </div>
              </div>

              {/* Layered Secondary Detail Card - Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-[#E8DFD8] max-w-xs hidden sm:block">
                <div className="flex items-start space-x-3">
                  <img
                    src={WEDDING_IMAGES.heroDetail.url}
                    alt={WEDDING_IMAGES.heroDetail.alt}
                    className="w-14 h-14 rounded object-cover border border-[#EFE8E1] shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#A37E52] font-semibold block">
                      Planning Consultation
                    </span>
                    <p className="text-xs font-serif text-[#1F1D1B] font-medium leading-tight mt-0.5">
                      Tailored color palette, layout, and timeline strategy
                    </p>
                    <div className="flex items-center space-x-1 mt-1 text-[11px] text-[#70665E]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Instant calendar booking</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
