import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function TripFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: 1,
    interests: []
  });
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        destination: initialData.destination || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        budget: initialData.budget || '',
        travelers: initialData.travelers || 1,
        interests: initialData.interests || []
      });
    } else {
      setFormData({
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        travelers: 1,
        interests: []
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    if (!formData.interests.includes(interestInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    onSubmit({
      ...formData,
      budget: Number(formData.budget),
      travelers: Number(formData.travelers)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-black/5 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-wandor-muted hover:text-black p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <h2 className="text-[28px] font-semibold text-black tracking-tight mb-2 leading-tight">
            {initialData ? 'Edit Trip Details' : 'Create New Trip'}
          </h2>
          <p className="text-wandor-muted text-[15px]">
            {initialData ? 'Update your trip parameters below' : 'Plan your next adventure with friends'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
              Trip Title *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Summer in Tokyo & Kyoto"
              className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
              Destination *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Tokyo, Japan"
              className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                Budget (USD) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="3000"
                min="0"
                className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
                Travelers *
              </label>
              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                min="1"
                className="w-full h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-wandor-muted mb-2 uppercase tracking-wider">
              Interests & Activities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                placeholder="e.g. Hiking, Food, Museums"
                className="flex-1 h-14 bg-black/5 border border-transparent rounded-2xl px-4 text-black placeholder-black/40 text-[15px] focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/5 transition-all"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="bg-black/5 hover:bg-black/10 text-black px-5 rounded-2xl text-[14px] font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[32px]">
              {formData.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-black/5 text-wandor-muted text-[13px] px-3 py-1.5 rounded-full flex items-center gap-2 font-medium"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(idx)}
                    className="hover:text-red-500 text-black/40 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-black/5 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-full text-[14px] font-medium text-wandor-muted hover:text-black hover:bg-black/5 transition-colors uppercase tracking-[0.04em]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full text-[14px] font-medium text-white bg-wandor-prompt hover:bg-[#7a4827] shadow-lg shadow-wandor-prompt/20 transition-all active:scale-95 uppercase tracking-[0.04em]"
            >
              {initialData ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
