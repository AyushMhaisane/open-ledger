import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  Plus,
  Search,
  Loader2,
  FileText
} from 'lucide-react';

type Invoice = {
  id: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  tenants?: {
    full_name: string;
  };
  properties?: {
    name: string;
  };
};

export default function Finance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    collected: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  async function fetchInvoices() {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          tenants (full_name),
          properties (name)
        `)
        .eq('owner_id', user.id)
        .order('due_date', { ascending: false });

      if (error) throw error;

      const invoiceData = (data || []) as Invoice[];
      setInvoices(invoiceData);
      calculateStats(invoiceData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data: Invoice[]) {
    const collected = data
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0);

    const pending = data
      .filter(i => i.status === 'pending' || i.status === 'partial')
      .reduce((sum, i) => sum + (i.amount - i.amount_paid), 0);

    setStats({ collected, pending, overdue: 0 });
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Finance & Billing
          </h1>
          <p className="text-slate-500 mt-2">
            Track rent payments and generate invoices.
          </p>
        </div>

        {/* ✅ Replaced Button with Link */}
        <Link
          to="/finance/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 w-fit"
        >
          <Plus className="w-5 h-5" />
          Create Invoice
        </Link>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-medium">
              Collected this Month
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ₹{stats.collected.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-medium">
              Pending Dues
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            ₹{stats.pending.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-medium">
              Total Invoices
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {invoices.length}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">
            Recent Invoices
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tenant..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">
              No invoices found
            </h3>
            <p className="text-slate-500">
              Create a new invoice to start collecting rent.
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Property</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {invoice.tenants?.full_name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {invoice.properties?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {invoice.due_date}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${
                        invoice.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : invoice.status === 'pending' || invoice.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-medium text-sm hover:underline">
                      Record Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
