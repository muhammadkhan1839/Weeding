/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { ServicesSection } from './components/public/ServicesSection';
import { AboutSection } from './components/public/AboutSection';
import { BookingSection } from './components/public/BookingSection';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DatabaseSetupModal } from './components/admin/DatabaseSetupModal';
import { Service } from './types/database';
import { Database, Sparkles, Loader2, Info } from 'lucide-react';

function MainAppContent() {
  const { isAdmin, isAuthChecking, isConfigured } = useAuth();
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Handle service selection from ServicesSection
  const handleSelectService = (service: Service) => {
    setPreSelectedService(service);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Admin view
  if (currentView === 'admin') {
    if (isAuthChecking) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#1F1D1B] text-white flex items-center justify-center font-serif text-xl mb-4 shadow-md">
            É
          </div>
          <Loader2 className="w-6 h-6 text-[#A37E52] animate-spin mb-3" />
          <h3 className="font-serif text-xl font-medium text-[#1F1D1B]">
            Verifying Administrative Access
          </h3>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Validating session against the studio admin credentials...
          </p>
        </div>
      );
    }

    if (isAdmin) {
      return (
        <AdminDashboard onBackToWebsite={() => setCurrentView('public')} />
      );
    }

    return (
      <AdminLogin
        onBackToWebsite={() => setCurrentView('public')}
        onOpenSetupGuide={() => setIsSetupModalOpen(true)}
      />
    );
  }

  // Public Website View
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#242220]">
      {/* Top Notice Banner: Supabase status & Quick SQL Setup guide */}
      {!isConfigured && (
        <div className="bg-[#24201D] text-[#E0D7CE] text-xs py-2 px-4 border-b border-[#3B342F] flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-3xl truncate">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Supabase Setup:</strong> Connect your live project with <code className="bg-[#38312B] px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_URL</code> and <code className="bg-[#38312B] px-1 py-0.5 rounded text-amber-300">VITE_SUPABASE_ANON_KEY</code> in <code className="bg-[#38312B] px-1 py-0.5 rounded">.env</code>.
            </span>
          </div>
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="text-[11px] underline text-[#D9C3AC] hover:text-white shrink-0 ml-4 font-medium cursor-pointer"
          >
            View SQL Schema &amp; Instructions
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenAdmin={() => setCurrentView('admin')}
        onOpenBooking={handleOpenBooking}
      />

      {/* Public Sections */}
      <main className="flex-1">
        <Hero
          onBookNow={handleOpenBooking}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <ServicesSection onSelectService={handleSelectService} />

        <AboutSection />

        <BookingSection initialService={preSelectedService} />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setCurrentView('admin')} />

      {/* Database Setup Modal */}
      <DatabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </AuthProvider>
  );
}
