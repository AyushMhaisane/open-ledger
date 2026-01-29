import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Building2, 
  MapPin, 
  Users, 
  Wallet, 
  ArrowLeft,
  Plus,
  MoreVertical,
  BedDouble,
  Bath,
  Loader2,
  X,
  Check
} from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [units, setUnits] = useState<any[]>([]);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);

  // Form State for New Unit
  const [newUnit, setNewUnit] = useState({
    name: '',
    rent: '',
    floor: ''
  });

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  async function fetchPropertyData() {
    try {
      if (!id) return;

      // 1. Fetch Property Details
      const { data: propData, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (propError) throw propError;
      setProperty(propData);

      // 2. Fetch Units for this Property
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', id)
        .order('name', { ascending: true });

      if (unitError) throw unitError;
      setUnits(unitData || []);

    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('units')
        .insert([
          {
            property_id: id,
            name: newUnit.name,
            rent_amount: parseFloat(newUnit.rent),
            floor_number: newUnit.floor || null,
            status: 'vacant' // Default status
          }
        ]);

      if (error) throw error;

      // Reset and Refresh
      setIsAddUnitOpen(false);
      setNewUnit({ name: '', rent: '', floor: '' });
      fetchPropertyData(); // Refresh the list
      
    } catch (error) {
      alert('Error adding unit');
      console.error(error);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {/* 1. HEADER & NAVIGATION */}
      <div className="mb-6">
        <Link to="/properties" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{property?.name}</h1>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <MapPin className="w-4 h-4" />
                {property?.address}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50">
               Edit Details
             </button>
             <button 
               onClick={() => setIsAddUnitOpen(true)}
               className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md flex items-center gap-2"
             >
               <Plus className="w-4 h-4" />
               Add Unit
             </button>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW FOR THIS PROPERTY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Units</p>
            <p className="text-2xl font-bold text-slate-900">{units.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Occupied</p>
            <p className="text-2xl font-bold text-slate-900">
              {units.filter(u => u.status === 'occupied').length}
            </p>
          </div>
        </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Potential Rent</p>
            <p className="text-2xl font-bold text-slate-900">
              ₹{units.reduce((sum, u) => sum + (u.rent_amount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 3. UNITS LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Units & Rooms</h3>
        </div>
        
        {units.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BedDouble className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold">No units added yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Create units (rooms, flats) to start assigning tenants.
            </p>
            <button 
              onClick={() => setIsAddUnitOpen(true)}
              className="text-indigo-600 font-bold hover:underline"
            >
              + Add your first unit
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Unit Name</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Rent Status</th>
                <th className="px-6 py-4">Rent Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {units.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {unit.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {unit.floor_number || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${unit.status === 'vacant' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}
                    `}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    ₹{unit.rent_amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 4. ADD UNIT MODAL (Simple Overlay) */}
      {isAddUnitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Add New Unit</h3>
              <button 
                onClick={() => setIsAddUnitOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddUnit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Unit Name / Number</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Flat 101 or Room A"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={newUnit.name}
                  onChange={e => setNewUnit({...newUnit, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
                  <input 
                    type="number" 
                    placeholder="5000"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={newUnit.rent}
                    onChange={e => setNewUnit({...newUnit, rent: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Floor Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 1"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={newUnit.floor}
                    onChange={e => setNewUnit({...newUnit, floor: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddUnitOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Save Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}