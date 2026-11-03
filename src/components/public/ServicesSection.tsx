import React from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types/database';
import { WEDDING_IMAGES } from '../../data/weddingImages';
import { Clock, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

// Maps services to curated high-resolution wedding imagery
function getServiceImage(service: Service, index: number) {
  if (service.image_url) return service.image_url;

  const nameLower = service.name.toLowerCase();
  if (nameLower.includes('full') || nameLower.includes('creative')) {
    return WEDDING_IMAGES.services.fullService.url;
  }
  if (nameLower.includes('design') || nameLower.includes('styling') || nameLower.includes('floral')) {
    return WEDDING_IMAGES.services.designStyling.url;
  }
  if (nameLower.includes('day') || nameLower.includes('coordination')) {
    return WEDDING_IMAGES.services.coordination.url;
  }
  if (nameLower.includes('elopement') || nameLower.includes('destination') || nameLower.includes('intimate')) {
    return WEDDING_IMAGES.services.elopement.url;
  }
  if (nameLower.includes('vendor')) {
    return WEDDING_IMAGES.services.vendorReview.url;
  }

  // Fallback cyclic list
  const fallbackList = [
    WEDDING_IMAGES.services.consultation.url,
    WEDDING_IMAGES.services.fullService.url,
    WEDDING_IMAGES.services.designStyling.url,
    WEDDING_IMAGES.services.coordination.url,
    WEDDING_IMAGES.services.elopement.url,
  ];
  return fallbackList[index % fallbackList.length];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { activeServices } = useApp();

  return (
    <section id="services" className="py-24 bg-[#F8F5F1] border-b border-[#ECE5DD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C7A6B]">
            <span className="w-5 h-px bg-[#A37E52]" />
            <span>Curated Offerings &amp; Consultations</span>
            <span className="w-5 h-px bg-[#A37E52]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1D1B] font-normal leading-tight">
            Thoughtfully tailored planning partnerships for your once-in-a-lifetime celebration.
          </h2>
          <p className="text-[#615850] text-base sm:text-lg font-light leading-relaxed">
            Every couple’s story demands a bespoke logistical blueprint. Select a dedicated consultation session below to begin shaping your wedding timeline, design, and vendor team.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, idx) => {
            const imageUrl = getServiceImage(service, idx);
            const isFeatured = idx === 1; // Full-service highlighted subtly

            return (
              <div
                key={service.id}
                className={`flex flex-col bg-white rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl group ${
                  isFeatured
                    ? 'border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-md'
                    : 'border-[#E6DFD6] hover:border-[#C5A880]'
                }`}
              >
                {/* Service Visual Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EFE8E1]">
                  <img
                    src={imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Pricing tag inside image corner */}
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-xs uppercase tracking-wider text-[#F2E8DC] font-medium block">
                      Consultation Investment
                    </span>
                    <span className="font-serif text-2xl font-medium tracking-tight text-white">
                      ${Number(service.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Duration in top right */}
                  <div className="absolute top-3 right-3 bg-[#1F1D1B]/80 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs flex items-center space-x-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#D9C3AC]" />
                    <span>{service.duration_minutes} Minutes</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1F1D1B] font-medium leading-snug group-hover:text-[#8A6740] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#5C544E] font-light leading-relaxed mt-2.5">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-[#F2ECE5] flex items-center justify-between">
                    <div className="text-xs text-[#8C7A6B]">
                      <span>Real-time availability</span>
                    </div>

                    <button
                      onClick={() => onSelectService(service)}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold tracking-wider uppercase text-[#1F1D1B] group-hover:text-[#8A6740] transition-colors cursor-pointer py-1.5 px-3 rounded hover:bg-[#F8F5F1]"
                    >
                      <span>Book Session</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {activeServices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-[#E8DFD8] p-8">
            <p className="font-serif text-xl text-[#1F1D1B]">No active services currently listed.</p>
            <p className="text-sm text-[#6B6158] mt-1">Please log into the studio admin dashboard to activate wedding planning offerings.</p>
          </div>
        )}

      </div>
    </section>
  );
};
