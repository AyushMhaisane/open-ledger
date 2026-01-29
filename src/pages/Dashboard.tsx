import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Building2, 
  Users, 
  Wallet, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { 
      label: 'Total Properties', 
      value: '0', 
      helper: 'No properties added',
      icon: Building2, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'hover:border-blue-200'
    },
    { 
      label: 'Total Tenants', 
      value: '0', 
      helper: 'No active tenants',
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-200'
    },
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
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95">
          <Plus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      {/* 2. ONBOARDING HINT (Dismissible in future) */}
      <div className="mb-10 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Building2 className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs">1</span>
            Let's get your ledger set up
          </h3>
          <p className="text-indigo-200 mb-6 max-w-xl">
            You are 3 steps away from automated billing. Start by adding your first building or apartment complex.
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              Start Setup <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-indigo-200 hover:text-white text-sm font-medium px-4 py-2">
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* 3. ALIVE STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => {
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
                {index === 3 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    Action Needed
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

      {/* 4. HIGH CONTRAST EMPTY STATE */}
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center hover:border-indigo-300 transition-colors group">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 transition-colors duration-300">
          <Building2 className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties listed yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Your portfolio is empty. Add your first property to start tracking tenants and generating invoices.
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto">
          <Plus className="w-5 h-5" />
          Create First Property
        </button>
      </div>
    </DashboardLayout>
  );
}