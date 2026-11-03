import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Save, Check, AlertCircle, Building2, Clock, Mail, Phone, MapPin } from 'lucide-react';

export const BusinessSettingsTab: React.FC = () => {
  const { businessSettings, updateBusinessSettings } = useApp();

  const [businessName, setBusinessName] = useState(businessSettings.business_name);
  const [businessEmail, setBusinessEmail] = useState(businessSettings.business_email);
  const [businessPhone, setBusinessPhone] = useState(businessSettings.business_phone);
  const [businessAddress, setBusinessAddress] = useState(businessSettings.business_address);
  const [slotInterval, setSlotInterval] = useState(businessSettings.slot_interval_minutes);
  const [bookingNotice, setBookingNotice] = useState(businessSettings.booking_notice_hours);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setBusinessName(businessSettings.business_name);
    setBusinessEmail(businessSettings.business_email);
    setBusinessPhone(businessSettings.business_phone);
    setBusinessAddress(businessSettings.business_address);
    setSlotInterval(businessSettings.slot_interval_minutes);
    setBookingNotice(businessSettings.booking_notice_hours);
  }, [businessSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    const success = await updateBusinessSettings({
      business_name: businessName.trim(),
      business_email: businessEmail.trim(),
      business_phone: businessPhone.trim(),
      business_address: businessAddress.trim(),
      slot_interval_minutes: Number(slotInterval),
      booking_notice_hours: Number(bookingNotice),
    });

    setSaving(false);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    } else {
      setErrorMsg('Failed to update business settings in Supabase.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#ECE5DD]">
        <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
          Studio Preferences
        </span>
        <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
          Business Settings &amp; Scheduling Parameters
        </h2>
        <p className="text-xs text-[#6B6158] mt-1">
          Configure official wedding studio credentials, location details, appointment slot pacing, and minimum advance notice.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business settings updated successfully! Live website and booking logic are synchronized.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Studio Identity Card */}
        <div className="bg-white rounded-xl border border-[#E6DFD6] p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-medium text-[#1F1D1B] flex items-center space-x-2 pb-3 border-b border-[#F2ECE5]">
            <Building2 className="w-5 h-5 text-[#A37E52]" />
            <span>Studio Identity &amp; Contact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Studio Name *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Étoile Wedding Planning & Design Studio"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              />
              <span className="text-[11px] text-[#8C7A6B] mt-1 block">
                Shown in website title, navbar, and confirmation dossier.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Studio Email *
              </label>
              <input
                type="email"
                required
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="concierge@etoilestudio.com"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Studio Phone *
              </label>
              <input
                type="text"
                required
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="(415) 890-3421"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Studio Address *
              </label>
              <input
                type="text"
                required
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="450 Sutter Street, Suite 800, San Francisco, CA"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              />
            </div>
          </div>
        </div>

        {/* Scheduling Engine Parameters Card */}
        <div className="bg-white rounded-xl border border-[#E6DFD6] p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-medium text-[#1F1D1B] flex items-center space-x-2 pb-3 border-b border-[#F2ECE5]">
            <Clock className="w-5 h-5 text-[#A37E52]" />
            <span>Booking Engine Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Slot Interval (Minutes) *
              </label>
              <select
                value={slotInterval}
                onChange={(e) => setSlotInterval(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              >
                <option value={15}>Every 15 Minutes</option>
                <option value={30}>Every 30 Minutes (Recommended)</option>
                <option value={45}>Every 45 Minutes</option>
                <option value={60}>Every 60 Minutes (Top of the hour)</option>
              </select>
              <span className="text-[11px] text-[#8C7A6B] mt-1 block">
                Controls the start-time cadence of generated consultation slots.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                Booking Notice (Hours in Advance) *
              </label>
              <input
                type="number"
                min={0}
                max={168}
                required
                value={bookingNotice}
                onChange={(e) => setBookingNotice(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
              />
              <span className="text-[11px] text-[#8C7A6B] mt-1 block">
                Minimum advance notice required before a consultation can be reserved (e.g. 24 hours prevents same-day drop-ins).
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#D9C3AC]" />
            <span>{saving ? 'Updating Settings...' : 'Save Studio Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
