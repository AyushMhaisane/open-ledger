import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Users, 
  Wallet, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  Loader2,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // State for Real Numbers
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    occupancy: 0,
    dues: 0
  });
  
  const [recentProperties, setRecentProperties] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!user) return;

        // 1. Fetch Properties
        const { data: properties } = await supabase
          .from('properties')
          .select('id, name, address, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        // 2. Fetch Tenants (Count)
        const { count: tenantCount } = await supabase
          .from('tenants')
          .select('*', { count: 'exact', head: true }) // head:true means "just count, don't give me data"
          .eq('owner_id', user.id)
          .eq('status', 'active');

        // 3. Fetch Units (For Occupancy Rate)
        const { data: units } = await supabase
          .from('units')
          .select('status')
          .in('property_id', (properties || []).map(p => p.id));

        // 4. Fetch Invoices (For Pending Dues)
        const { data: invoices } = await supabase
          .from('invoices')
          .select('amount, amount_paid, status')
          .eq('owner_id', user.id)
          .neq('status', 'paid'); // Get pending or partial

        // --- CALCULATIONS ---

        // Calculate Occupancy
        const totalUnits = units?.length || 0;
        const occupiedUnits = units?.filter(u => u.status === 'occupied').length || 0;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

        // Calculate Pending Dues
        const pendingTotal = invoices?.reduce((sum, inv) => {
          const paid = inv.amount_paid || 0;
          return sum + (inv.amount - paid);
        }, 0) || 0;

        // Update State
        setStats({
          properties: properties?.length || 0,
          tenants: tenantCount || 0,
          occupancy: occupancyRate,
          dues: pendingTotal
        });
        
        setRecentProperties(properties || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const statCards = [
    { 
      label: 'Total Properties', 
      value: stats.properties.toString(), 
      helper: stats.properties === 0 ? 'No properties added' : 'Active buildings',
      icon: Building2, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200'
    },
    { 
      label: 'Total Tenants', 
      value: stats.tenants.toString(), 
      helper: 'Active residents',
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200'
    },
    { 
      label: 'Occupancy Rate', 
      value: `${stats.occupancy}%`, 
      helper: 'Unit utilization',
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-200'
    },
    { 
      label: 'Pending Dues', 
      value: `₹${stats.dues.toLocaleString()}`, 
      helper: 'Uncollected rent',
      icon: Wallet, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'hover:border-amber-200'
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <Link 
          to="/properties/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Property
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`
                    bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 
                    hover:shadow-md hover:-translate-y-1 cursor-default group ${stat.border}
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-3 rounded-xl transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    {/* Only show 'Action Needed' on Pending Dues if value > 0 */}
                    {index === 3 && stats.dues > 0 && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        <AlertCircle className="w-3 h-3" /> Action Needed
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                    {stat.helper}
                  </p>
                </div>
              );
            })}
          </div>

          {stats.properties === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center hover:border-indigo-300 transition-colors group">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 transition-colors duration-300">
                <Building2 className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No properties listed yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
                Your portfolio is empty. Add your first property to start tracking tenants.
              </p>
              <Link 
                to="/properties/new"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto w-fit"
              >
                <Plus className="w-5 h-5" />
                Create First Property
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Your Properties</h3>
                <Link to="/properties" className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentProperties.map((property) => (
                  <Link 
                    key={property.id} 
                    to={`/properties/${property.id}`}
                    className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0 group-hover:bg-indigo-100 transition-colors">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{property.name}</h4>
                      <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.address}
                      </div>
                    </div>
                    <div className="text-right">
                       <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}