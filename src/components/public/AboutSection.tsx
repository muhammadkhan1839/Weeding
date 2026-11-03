import React from 'react';
import { WEDDING_IMAGES } from '../../data/weddingImages';
import { Compass, Sparkles, HeartHandshake, ShieldCheck, Check } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#FAF8F5] border-b border-[#ECE5DD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: Story & Layered Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Storytelling Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Primary large image */}
              <div className="rounded-xl overflow-hidden shadow-xl border border-[#E4DDD4] aspect-[4/3] bg-[#EFE8E1]">
                <img
                  src={WEDDING_IMAGES.aboutLead.url}
                  alt={WEDDING_IMAGES.aboutLead.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Offset secondary image */}
              <div className="absolute -bottom-10 -right-4 sm:-right-8 w-1/2 rounded-lg overflow-hidden shadow-2xl border-4 border-[#FAF8F5] aspect-square bg-[#EFE8E1] hidden sm:block">
                <img
                  src={WEDDING_IMAGES.aboutStudio.url}
                  alt={WEDDING_IMAGES.aboutStudio.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Small studio badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded shadow-sm text-xs font-serif text-[#1F1D1B] border border-[#E8DFD8]">
                Studio Atelier · Est. 2014
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Principles */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C7A6B]">
              <span className="w-5 h-px bg-[#A37E52]" />
              <span>Studio Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1D1B] font-normal leading-tight">
              Where artistic vision meets meticulous logistical mastery.
            </h2>

            <p className="text-[#59514A] text-base sm:text-lg font-light leading-relaxed">
              We believe a truly unforgettable wedding is not merely styled—it is curated like a work of immersive theater. Every transition, musical cue, floral scent, and course pairing must unfold naturally, allowing you to be completely present with the people you love.
            </p>

            <div className="pt-2 space-y-4 text-sm text-[#4A433D]">
              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE8E1] text-[#8A6740] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#1F1D1B] font-medium">Bespoke Vendor Alignment</h4>
                  <p className="text-xs text-[#6E645C] mt-0.5">
                    We match your aesthetic and budget with premier floral sculptors, Michelin-caliber caterers, and renowned photographers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE8E1] text-[#8A6740] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#1F1D1B] font-medium">Micro-Orchestrated Timelines</h4>
                  <p className="text-xs text-[#6E645C] mt-0.5">
                    From load-in protocols to ceremony cues and send-off pacing, every logistical facet is timed to perfection.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-6 h-6 rounded-full bg-[#EFE8E1] text-[#8A6740] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#1F1D1B] font-medium">Tactile Design &amp; Atmospheric Styling</h4>
                  <p className="text-xs text-[#6E645C] mt-0.5">
                    Custom linen drapery, calligraphed heirloom stationery, and ambient acoustic balance for an elevated guest journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#ECE5DD] flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D9CFC4] shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Aurelia Vance, Creative Director"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-base font-medium text-[#1F1D1B]">Aurelia Vance</p>
                <p className="text-xs uppercase tracking-wider text-[#8C7A6B]">Founder &amp; Principal Creative Director</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
