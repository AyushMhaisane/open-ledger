import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Building2, 
  MapPin, 
  Home, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export default function AddProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'apartment', // Default value
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name || !formData.address) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // 1. Insert data into Supabase 'properties' table
      const { data, error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            owner_id: user?.id, // Link to the logged-in user
            name: formData.name,
            type: formData.type,
            address: formData.address,
            // image_url: we will add file upload later
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Success! Redirect to the Dashboard or Properties list
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Error adding property:', err);
      setError(err.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Property</h1>
          <p className="text-slate-500 mt-2">
            Start tracking a new building, hostel, or apartment complex.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Property Name */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Property Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sunshine Heights or Metro Hostel"
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
                  />
                  <Building2 className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="block w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="apartment">Apartment Complex</option>
                    <option value="hostel">Hostel / PG</option>
                    <option value="commercial">Commercial / Office</option>
                  </select>
                  <Home className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  {/* Custom arrow for select */}
                  <div className="absolute right-4 top-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Address
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Full street address..."
                    className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400 resize-none"
                  />
                  <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Property"
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}