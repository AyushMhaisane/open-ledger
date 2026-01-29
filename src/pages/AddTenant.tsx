import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Building2, 
  Home,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function AddTenant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data for Dropdowns
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    property_id: '',
    unit_id: '',
    lease_start: new Date().toISOString().split('T')[0] // Today's date
  });

  // 1. Fetch Properties on Load
  useEffect(() => {
    async function fetchProperties() {
      if (!user) return;
      const { data } = await supabase
        .from('properties')
        .select('id, name')
        .eq('owner_id', user.id);
      setProperties(data || []);
    }
    fetchProperties();
  }, [user]);

  // 2. Fetch Units when Property Changes
  useEffect(() => {
    async function fetchUnits() {
      if (!formData.property_id) {
        setUnits([]);
        return;
      }
      
      const { data } = await supabase
        .from('units')
        .select('id, name, status')
        .eq('property_id', formData.property_id)
        .eq('status', 'vacant'); // Only show vacant units

      setUnits(data || []);
    }
    fetchUnits();
  }, [formData.property_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.property_id || !formData.unit_id) {
      setError("Please select a property and a unit.");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('tenants')
        .insert([
          {
            owner_id: user?.id,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            property_id: formData.property_id,
            unit_id: formData.unit_id,
            lease_start_date: formData.lease_start,
            status: 'active'
          }
        ]);

      if (insertError) throw insertError;

      navigate('/tenants');
    } catch (err: any) {
      console.error('Error adding tenant:', err);
      setError(err.message || 'Failed to add tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Tenant</h1>
          <p className="text-slate-500 mt-2">
            Register a new resident and assign them to a unit.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  Tenant Details
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                    />
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                      <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                      <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                  Unit Assignment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Select Property</label>
                    <div className="relative">
                      <select
                        required
                        className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-white"
                        value={formData.property_id}
                        onChange={e => setFormData({...formData, property_id: e.target.value, unit_id: ''})}
                      >
                        <option value="">Select Building...</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <Building2 className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Select Unit</label>
                    <div className="relative">
                      <select
                        required
                        disabled={!formData.property_id}
                        className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                        value={formData.unit_id}
                        onChange={e => setFormData({...formData, unit_id: e.target.value})}
                      >
                        <option value="">
                          {!formData.property_id ? "Select Property First" : "Select Room/Flat..."}
                        </option>
                        {units.map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                      <Home className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Lease Start Date</label>
                  <div className="relative">
                    <input
                      required
                      type="date"
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      value={formData.lease_start}
                      onChange={e => setFormData({...formData, lease_start: e.target.value})}
                    />
                    <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/tenants')}
                  className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Register Tenant"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}