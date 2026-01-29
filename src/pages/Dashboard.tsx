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
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    tenants: 0,
    occupancy: 0,
    dues: 0
  });
  
  // State to store the actual list of properties
  const [recentProperties, setRecentProperties] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        if (!user) return;

        // 1. Get Property Count & Data
        const { data: properties, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (propError) throw propError;

        // 2. Update State
        setStats(prev => ({
          ...prev,
          properties: properties?.length || 0
        }));
        
        setRecentProperties(properties || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  // Define the cards dynamically based on state
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
      helper: 'No active tenants',
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200'
    },
    // ... keep other stats same for now
    { 
      label: 'Occupancy Rate', 
      value: '0%', 
      helper: 'Add units to calculate',
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-200'
    },
    { 
      label: 'Pending Dues', 
      value: '₹0.00', 
      helper: 'No outstanding bills',
      icon: Wallet, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'hover:border-amber-200'
    },
  ];

  return (
    <DashboardLayout>
      {/* 1. WELCOME SECTION */}
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
          {/* 2. STATS GRID */}
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

          {/* 3. CONDITIONAL CONTENT: Empty State OR Property List */}
          {stats.properties === 0 ? (
            // EMPTY STATE
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
            // RECENT PROPERTIES LIST
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg">Your Properties</h3>
                <Link to="/properties" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentProperties.map((property) => (
                  <div key={property.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}