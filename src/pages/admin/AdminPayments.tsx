import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentStatus } from '../../data/adminData';
import { CreditCard, DollarSign, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG: Record<PaymentStatus, { color: string; icon: React.ReactNode }> = {
  completed: { color: 'bg-green-500/20 text-green-400 border-green-500/20', icon: <DollarSign size={11} /> },
  pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20', icon: <Clock size={11} /> },
  failed: { color: 'bg-red-500/20 text-red-400 border-red-500/20', icon: <AlertTriangle size={11} /> },
  refunded: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/20', icon: <RefreshCw size={11} /> },
};

const METHOD_ICONS: Record<string, string> = {
  'Credit Card': '💳',
  'Debit Card': '🏦',
  'PayPal': '🅿️',
  'Apple Pay': '🍎',
  'Google Pay': 'G',
};

export const AdminPayments: React.FC = () => {
  const { payments } = useStore();
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'all'>('all');

  const filtered = filterStatus === 'all' ? payments : payments.filter(p => p.status === filterStatus);

  // Summary calculations
  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Payments</h2>
        <p className="text-white/40 text-sm mt-1">{payments.length} transactions total</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Collected', value: totalCollected, color: 'from-green-600/30 to-green-500/10 border-green-500/20', text: 'text-green-400', icon: <DollarSign size={18} /> },
          { label: 'Pending', value: totalPending, color: 'from-yellow-600/30 to-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: <Clock size={18} /> },
          { label: 'Refunded', value: totalRefunded, color: 'from-blue-600/30 to-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: <RefreshCw size={18} /> },
          { label: 'Failed', value: totalFailed, color: 'from-red-600/30 to-red-500/10 border-red-500/20', text: 'text-red-400', icon: <AlertTriangle size={18} /> },
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} border rounded-2xl p-5`}>
            <div className={`${card.text} mb-3`}>{card.icon}</div>
            <p className="text-xl font-bold text-white">₹{card.value.toLocaleString('en-IN')}</p>
            <p className="text-xs text-white/40 mt-1 font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === s
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/8 border border-white/5'
            }`}
          >
            {s === 'all' ? `All (${payments.length})` : `${s} (${payments.filter(p => p.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="text-left text-white/30 font-semibold py-3 px-4">Transaction ID</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Order</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Customer</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Method</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Amount</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Date</th>
                <th className="text-left text-white/30 font-semibold py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(payment => {
                const cfg = STATUS_CONFIG[payment.status];
                return (
                  <tr key={payment.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={13} className="text-white/20" />
                        <span className="font-mono text-white/50">{payment.transactionId}</span>
                      </div>
                      {payment.last4 && (
                        <p className="text-white/20 text-[10px] ml-5 mt-0.5">••• {payment.last4}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-white/40">{payment.orderId}</td>
                    <td className="py-3 px-4 font-semibold text-white/80">{payment.customerName}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-white/50">
                        <span>{METHOD_ICONS[payment.method] ?? '💰'}</span>
                        {payment.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">₹{payment.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-white/40">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize w-fit ${cfg.color}`}>
                        {cfg.icon} {payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/20 text-sm">No payments found.</div>
        )}
      </div>
    </div>
  );
};
