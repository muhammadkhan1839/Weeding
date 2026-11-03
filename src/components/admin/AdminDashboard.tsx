import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { OverviewTab } from './tabs/OverviewTab';
import { AppointmentsTab } from './tabs/AppointmentsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { BusinessHoursTab } from './tabs/BusinessHoursTab';
import { BlockedDatesTab } from './tabs/BlockedDatesTab';
import { BusinessSettingsTab } from './tabs/BusinessSettingsTab';
import { DatabaseSetupModal } from './DatabaseSetupModal';
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Clock,
  CalendarOff,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  Menu,
  X,
  Shield,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

type TabType =
  | 'overview'
  | 'appointments'
  | 'services'
  | 'hours'
  | 'blocked'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const { user, signOut } = useAuth();
  const { businessSettings, appointments } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: CalendarCheck,
      badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null,
    },
    { id: 'services', label: 'Services & Packages', icon: Sparkles },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'blocked', label: 'Blocked Dates', icon: CalendarOff },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId as TabType);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#1F1D1B] text-white p-4 flex items-center justify-between border-b border-[#38332E]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-[#FAF8F5] text-[#1F1D1B] flex items-center justify-center font-serif text-sm">
            É
          </div>
          <span className="font-serif text-base font-medium">Studio Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded hover:bg-[#34302C]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1F1D1B] text-[#D9CFC4] flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Studio Brand */}
          <div className="flex items-center space-x-3 pb-6 border-b border-[#34302C]">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] text-[#1F1D1B] flex items-center justify-center font-serif text-lg shrink-0">
              É
            </div>
            <div className="overflow-hidden">
              <span className="font-serif text-lg font-medium text-white block truncate">
                {businessSettings.business_name}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#A37E52] font-semibold block">
                Studio Management
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#FAF8F5] text-[#1F1D1B] shadow-sm font-semibold'
                      : 'text-[#A89C90] hover:bg-[#2A2724] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#8A6740]' : 'text-[#8C7E72]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-[#34302C] space-y-3">
          {/* User badge */}
          <div className="text-xs">
            <p className="text-[10px] uppercase tracking-wider text-[#8C7E72] font-semibold">
              Authenticated Admin
            </p>
            <p className="font-medium text-white truncate mt-0.5">
              {user?.email || 'studio-director'}
            </p>
          </div>

          {/* SQL Setup Helper button */}
          <button
            onClick={() => setIsSetupModalOpen(true)}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#C5A880] hover:text-white bg-[#2A2724] hover:bg-[#34302C] rounded-md transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database &amp; SQL Setup</span>
          </button>

          {/* Return to website */}
          <button
            onClick={onBackToWebsite}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-[#A89C90] hover:text-white rounded transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <OverviewTab onNavigateToTab={(tab) => setActiveTab(tab as TabType)} />
        )}
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'hours' && <BusinessHoursTab />}
        {activeTab === 'blocked' && <BlockedDatesTab />}
        {activeTab === 'settings' && <BusinessSettingsTab />}
      </main>

      {/* Setup Guide Modal */}
      <DatabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
    </div>
  );
};
