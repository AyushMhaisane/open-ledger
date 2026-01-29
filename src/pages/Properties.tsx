import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Loader2,
  MoreVertical,
  Home
} from 'lucide-react';

export default function Properties() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Properties</h1>
          <p className="text-slate-500 mt-2">Manage your portfolio of buildings and units.</p>
        </div>
        <Link 
          to="/properties/new" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartments</option>
              <option value="hostel">Hostels</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : filteredProperties.length === 0 ? (
        // Empty Search Result
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No properties found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        // Properties Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Link 
              key={property.id} 
              to={`/properties/${property.id}`} // We will build this detail page next
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Header (Colored Banner) */}
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-600 relative p-6">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-1.5 rounded-lg text-white hover:bg-white/30 transition-colors cursor-pointer">
                  <MoreVertical className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center absolute -bottom-6 left-6 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-50 text-indigo-700 capitalize">
                    {property.type}
                  </span>
                  <span className="text-slate-400 font-medium">
                    0 Units {/* Placeholder until we fetch units */}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}