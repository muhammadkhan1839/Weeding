import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Mail, Phone, Clock, Shield } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { businessSettings, businessHours } = useApp();

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <footer id="contact" className="bg-[#1A1816] text-[#D4C8BC] pt-20 pb-12 border-t border-[#2B2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#2B2724]">
          
          {/* Studio Brand and Description */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#1A1816] flex items-center justify-center font-serif text-xl tracking-wider">
                É
              </div>
              <span className="font-serif text-2xl text-white font-medium tracking-wide">
                {businessSettings.business_name || 'Étoile Wedding Planning & Design Studio'}
              </span>
            </div>

            <p className="text-sm text-[#A89C90] font-light leading-relaxed max-w-sm">
              An atelier dedicated to bespoke wedding design, architectural venue styling, and tranquil wedding day coordination for modern couples worldwide.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-2 text-xs text-[#A37E52] hover:text-[#C5A880] transition-colors cursor-pointer group"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Studio Planner &amp; Owner Portal</span>
              </button>
            </div>
          </div>

          {/* Studio Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Studio Inquiries
            </h4>
            <div className="space-y-3 text-sm text-[#A89C90]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#A37E52] shrink-0 mt-0.5" />
                <span>{businessSettings.business_address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#A37E52] shrink-0" />
                <span>{businessSettings.business_phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#A37E52] shrink-0" />
                <span>{businessSettings.business_email}</span>
              </div>
            </div>
          </div>

          {/* Studio Consultation Hours */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
              Consultation Hours
            </h4>
            <div className="space-y-1.5 text-xs text-[#A89C90]">
              {businessHours.map((hour) => (
                <div key={hour.id} className="flex justify-between py-0.5">
                  <span className="text-[#8C7E72]">{weekdayNames[hour.weekday]}:</span>
                  <span className={hour.is_open ? 'text-[#FAF8F5]' : 'text-[#695F56] italic'}>
                    {hour.is_open ? `${hour.start_time.slice(0, 5)} - ${hour.end_time.slice(0, 5)}` : 'Private Studio Day'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6E6359] gap-4">
          <p>© {new Date().getFullYear()} {businessSettings.business_name}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>By Private Appointment Only</span>
            <span>·</span>
            <span>San Francisco &amp; Destinations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
