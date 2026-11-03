import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Shield, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenBooking }) => {
  const { businessSettings } = useApp();
  const { isAdmin, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-[#1F1D1B] text-[#FAF8F5] flex items-center justify-center font-serif text-xl tracking-wider shadow-sm">
              É
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl tracking-wide text-[#1F1D1B] font-medium block leading-none">
                {businessSettings.business_name || 'Étoile Wedding Studio'}
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7A6B] font-medium block mt-1">
                Bespoke Planning &amp; Design
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#4A4540]">
            <button
              onClick={() => scrollTo('services')}
              className="hover:text-[#1F1D1B] transition-colors py-1 cursor-pointer"
            >
              Curated Services
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:text-[#1F1D1B] transition-colors py-1 cursor-pointer"
            >
              Studio Philosophy
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="hover:text-[#1F1D1B] transition-colors py-1 cursor-pointer"
            >
              Reserve Consultation
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:text-[#1F1D1B] transition-colors py-1 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#6B6158] hover:text-[#1F1D1B] rounded border border-[#E0D7CE] hover:border-[#B8A89A] transition-colors cursor-pointer bg-white/50"
              title="Admin & Studio Management"
            >
              <Shield className="w-3.5 h-3.5 text-[#A37E52]" />
              <span>{isAdmin ? 'Planner Dashboard' : 'Admin Portal'}</span>
              {user && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
              )}
            </button>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] active:scale-[0.98] rounded-md transition-all shadow-sm cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D9C3AC]" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#6B6158] hover:text-[#1F1D1B] rounded border border-[#E0D7CE]"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4 text-[#A37E52]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F1D1B] rounded hover:bg-[#EFE8E1] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#EAE3DC] space-y-3">
            <button
              onClick={() => scrollTo('services')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#242220] hover:bg-[#F2ECE5] rounded"
            >
              Curated Services
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#242220] hover:bg-[#F2ECE5] rounded"
            >
              Studio Philosophy
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#242220] hover:bg-[#F2ECE5] rounded"
            >
              Reserve Consultation
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-[#242220] hover:bg-[#F2ECE5] rounded"
            >
              Contact
            </button>
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-white bg-[#1F1D1B] rounded-md shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#D9C3AC]" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
