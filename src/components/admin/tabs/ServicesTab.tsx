import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Service } from '../../../types/database';
import { Plus, Edit2, Check, X, Clock, DollarSign, Sparkles, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

export const ServicesTab: React.FC = () => {
  const { services, addService, updateService, toggleServiceActive } = useApp();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [price, setPrice] = useState(150);
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setDurationMinutes(60);
    setPrice(150);
    setIsActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setDurationMinutes(service.duration_minutes);
    setPrice(Number(service.price));
    setIsActive(service.is_active);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Service title cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    let success = false;
    if (editingService) {
      success = await updateService(editingService.id, {
        name: name.trim(),
        description: description.trim(),
        duration_minutes: Number(durationMinutes),
        price: Number(price),
        is_active: isActive,
      });
    } else {
      success = await addService({
        name: name.trim(),
        description: description.trim(),
        duration_minutes: Number(durationMinutes),
        price: Number(price),
        is_active: isActive,
      });
    }

    setSaving(false);
    if (success) {
      setIsModalOpen(false);
    } else {
      setErrorMsg('Failed to save service changes to Supabase.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE5DD] gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
            Studio Offerings
          </span>
          <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
            Wedding Planning Services &amp; Packages
          </h2>
          <p className="text-xs text-[#6B6158] mt-1">
            Manage packages, consultation lengths, investments, and active client booking visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D9C3AC]" />
          <span>Add New Service Offering</span>
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all ${
              service.is_active
                ? 'border-[#E6DFD6] shadow-sm'
                : 'border-[#EAE3DC] bg-[#FAF8F5]/60 opacity-80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-xl font-medium text-[#1F1D1B] leading-snug">
                      {service.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold tracking-wider ${
                    service.is_active ? 'text-emerald-700' : 'text-[#8C7A6B]'
                  }`}>
                    {service.is_active ? '● Active on Public Website' : '○ Deactivated (Hidden from Booking)'}
                  </span>
                </div>

                <span className="font-serif text-2xl font-semibold text-[#8A6740] shrink-0">
                  ${Number(service.price).toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-[#5C544E] font-light leading-relaxed mt-3">
                {service.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-5 border-t border-[#F2ECE5] flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-[#7A7067]">
                <Clock className="w-3.5 h-3.5 text-[#A37E52]" />
                <span>{service.duration_minutes} Minutes</span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Active / Inactive Toggle */}
                <button
                  onClick={() => toggleServiceActive(service.id, !service.is_active)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                    service.is_active
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title={service.is_active ? 'Deactivate this service' : 'Activate this service'}
                >
                  <span>{service.is_active ? 'Deactivate' : 'Activate'}</span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium text-[#38332E] hover:text-[#1F1D1B] bg-[#FAF8F5] hover:bg-[#F2ECE5] border border-[#D9CFC4] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#8C7A6B]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DD]">
              <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
                {editingService ? 'Edit Wedding Planning Service' : 'Add New Wedding Planning Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#7A7067] hover:text-[#1F1D1B] rounded hover:bg-[#F2ECE5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#4A433D] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full-Service Creative Direction &amp; Styling"
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#4A433D] mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what the couple receives during this consultation..."
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#4A433D] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    step={15}
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 60)}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#4A433D] mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={5}
                    required
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1F1D1B] border-[#D9CFC4] focus:ring-[#1F1D1B]"
                  />
                  <span className="text-xs text-[#332E2B] font-medium">
                    Publish this service on public wedding consultation booking page
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#ECE5DD] flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6B6158] hover:text-[#1F1D1B] rounded cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
