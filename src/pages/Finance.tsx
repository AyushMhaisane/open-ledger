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
  FileText,
  X
} from 'lucide-react';

export default function Finance() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState({ collected: 0, pending: 0, overdue: 0 });

  // Payment Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [processing, setProcessing] = useState(false);

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

      setInvoices(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(data: any[]) {
    const collected = data
      .filter(i => i.status === 'paid' || i.status === 'partial')
      .reduce((sum, i) => sum + (i.amount_paid || 0), 0);
      
    const pending = data
      .filter(i => i.status === 'pending' || i.status === 'partial')
      .reduce((sum, i) => sum + (i.amount - (i.amount_paid || 0)), 0);

    setStats({ collected, pending, overdue: 0 });
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (!selectedInvoice) return;

      const newAmountPaid = (selectedInvoice.amount_paid || 0) + parseFloat(paymentAmount);
      let newStatus = selectedInvoice.status;

      // Determine Status
      if (newAmountPaid >= selectedInvoice.amount) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0) {
        newStatus = 'partial';
      }

      // Update Database
      const { error } = await supabase
        .from('invoices')
        .update({ 
          amount_paid: newAmountPaid,
          status: newStatus
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;

      // Reset and Refresh
      setSelectedInvoice(null);
      setPaymentAmount('');
      fetchInvoices();

    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment');
    } finally {
      setProcessing(false);
    }
  };

  const openPaymentModal = (invoice: any) => {
    const remaining = invoice.amount - (invoice.amount_paid || 0);
    setSelectedInvoice(invoice);
    setPaymentAmount(remaining.toString()); // Pre-fill with remaining amount
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finance & Billing</h1>
          <p className="text-slate-500 mt-2">Track rent payments and generate invoices.</p>
        </div>
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
            <span className="text-slate-500 font-medium">Collected</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{stats.collected.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-medium">Pending Dues</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{stats.pending.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-slate-500 font-medium">Total Invoices</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{invoices.length}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Recent Invoices</h3>
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
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : invoices.length === 0 ? (
           <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold mb-1">No invoices found</h3>
            <p className="text-slate-500">Create a new invoice to start collecting rent.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{invoice.tenants?.full_name || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">{invoice.properties?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {invoice.due_date}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ₹{invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    ₹{invoice.amount_paid?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 
                        invoice.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {invoice.status !== 'paid' && (
                      <button 
                        onClick={() => openPaymentModal(invoice)}
                        className="text-indigo-600 font-bold text-sm hover:underline"
                      >
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAYMENT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Record Payment</h3>
              <button onClick={() => setSelectedInvoice(null)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
            
            <form onSubmit={handleRecordPayment} className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Recording payment for <span className="font-bold text-slate-900">{selectedInvoice.tenants?.full_name}</span>
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Amount Received (₹)</label>
                <input 
                  autoFocus
                  type="number" 
                  className="w-full text-2xl font-bold px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  max={selectedInvoice.amount - (selectedInvoice.amount_paid || 0)}
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  Max remaining: ₹{(selectedInvoice.amount - (selectedInvoice.amount_paid || 0)).toLocaleString()}
                </p>
              </div>

              <button 
                type="submit"
                disabled={processing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex justify-center"
              >
                {processing ? <Loader2 className="animate-spin" /> : "Confirm Payment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}