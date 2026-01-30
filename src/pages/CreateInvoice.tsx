import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  User, 
  Calendar, 
  IndianRupee, 
  FileText, 
  Loader2,
  AlertCircle,
  Building2
} from 'lucide-react';

export default function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data for Dropdowns
  const [properties, setProperties] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    property_id: '',
    tenant_id: '',
    amount: '',
    due_date: new Date().toISOString().split('T')[0], // Today
    bill_period: new Date().toISOString().split('T')[0], // Billing date reference
    notes: 'Monthly Rent'
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

  // 2. Fetch Tenants when Property Changes
  useEffect(() => {
    async function fetchTenants() {
      if (!formData.property_id) {
        setTenants([]);
        return;
      }
      
      // We also fetch the 'rent_amount' from the unit assigned to the tenant
      // Note: This assumes we successfully linked tenants -> units -> rent_amount earlier
      const { data } = await supabase
        .from('tenants')
        .select(`
          id, 
          full_name, 
          units ( rent_amount )
        `)
        .eq('property_id', formData.property_id)
        .eq('status', 'active'); // Only bill active tenants

      setTenants(data || []);
    }
    fetchTenants();
  }, [formData.property_id]);

  // 3. Auto-fill Amount when Tenant is selected
  const handleTenantChange = (tenantId: string) => {
    const selectedTenant = tenants.find(t => t.id === tenantId);
    
    // Auto-fill logic: If tenant has a unit with a rent amount, use it
    let autoRent = '';
    if (selectedTenant?.units?.rent_amount) {
      autoRent = selectedTenant.units.rent_amount.toString();
    }

    setFormData({
      ...formData,
      tenant_id: tenantId,
      amount: autoRent // Pre-fill the amount
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.tenant_id || !formData.amount) {
      setError("Please select a tenant and enter an amount.");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('invoices')
        .insert([
          {
            owner_id: user?.id,
            property_id: formData.property_id,
            tenant_id: formData.tenant_id,
            amount: parseFloat(formData.amount),
            due_date: formData.due_date,
            bill_period: formData.bill_period,
            notes: formData.notes,
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      navigate('/finance');
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Invoice</h1>
          <p className="text-slate-500 mt-2">
            Generate a rent bill or utility charge for a tenant.
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
              
              {/* Selection Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Property</label>
                  <div className="relative">
                    <select
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-white"
                      value={formData.property_id}
                      onChange={e => setFormData({...formData, property_id: e.target.value, tenant_id: '', amount: ''})}
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
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tenant</label>
                  <div className="relative">
                    <select
                      required
                      disabled={!formData.property_id}
                      className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
                      value={formData.tenant_id}
                      onChange={e => handleTenantChange(e.target.value)}
                    >
                      <option value="">
                        {!formData.property_id ? "Select Property First" : "Select Tenant..."}
                      </option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>{t.full_name}</option>
                      ))}
                    </select>
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Amount & Dates */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Bill Amount (₹)</label>
                  <div className="relative">
                    <input
                      required
                      type="number"
                      className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-lg font-semibold text-slate-900 placeholder:font-normal"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                    <IndianRupee className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 ml-1">
                    {formData.tenant_id && formData.amount 
                      ? "Auto-filled from unit rent settings." 
                      : "Enter the total amount due."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                    <div className="relative">
                      <input
                        required
                        type="date"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={formData.due_date}
                        onChange={e => setFormData({...formData, due_date: e.target.value})}
                      />
                      <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description / Notes</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                      />
                      <FileText className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/finance')}
                  className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Create Invoice"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}