import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../data/adminData';
import { ChevronDown, ChevronUp, Truck, CheckCircle, XCircle, Clock, Package, AlertCircle } from 'lucide-react';

const STATUS_META: Record<OrderStatus, { color: string; icon: React.ReactNode }> = {
  pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20', icon: <Clock size={12} /> },
  processing: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/20', icon: <Package size={12} /> },
  shipped: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/20', icon: <Truck size={12} /> },
  delivered: { color: 'bg-green-500/20 text-green-400 border-green-500/20', icon: <CheckCircle size={12} /> },
  cancelled: { color: 'bg-red-500/20 text-red-400 border-red-500/20', icon: <XCircle size={12} /> },
};

const ALL_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderTracking } = useStore();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleTrackingSubmit = (orderId: string) => {
    const val = trackingInputs[orderId];
    if (val?.trim()) {
      updateOrderTracking(orderId, val.trim());
      setTrackingInputs(prev => ({ ...prev, [orderId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <p className="text-white/40 text-sm mt-1">{orders.length} orders total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', ...ALL_STATUSES] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === s
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/8 border border-white/5'
            }`}
          >
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {sorted.map(order => {
          const isExpanded = expandedId === order.id;
          const meta = STATUS_META[order.status];
          return (
            <div key={order.id} className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden transition-all">
              {/* Summary row */}
              <div
                className="flex flex-wrap items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="font-mono text-xs text-white/40 w-32 shrink-0">{order.id}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white/90 text-sm">{order.customerName}</p>
                  <p className="text-white/30 text-xs">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm">₹{order.total.toLocaleString('en-IN')}</p>
                  <p className="text-white/30 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border capitalize ${meta.color}`}>
                  {meta.icon} {order.status}
                </span>
                {isExpanded ? <ChevronUp size={16} className="text-white/30" /> : <ChevronDown size={16} className="text-white/30" />}
              </div>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="text-white/30 font-semibold uppercase tracking-wider mb-1">Customer</p>
                      <p className="text-white/80">{order.customerName}</p>
                      <p className="text-white/40">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-white/30 font-semibold uppercase tracking-wider mb-1">Shipping To</p>
                      <p className="text-white/80">{order.address}</p>
                      <p className="text-white/40">{order.city}, {order.country}</p>
                    </div>
                    <div>
                      <p className="text-white/30 font-semibold uppercase tracking-wider mb-1">Tracking</p>
                      {order.trackingNumber ? (
                        <p className="text-purple-400 font-mono font-bold">{order.trackingNumber}</p>
                      ) : (
                        <p className="text-white/20 italic">Not assigned</p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">Items ({order.items.length})</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/3 rounded-xl px-3 py-2">
                          <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-white/10" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white/80 text-xs font-semibold truncate">{item.productName}</p>
                            {item.variant && <p className="text-white/30 text-[10px]">{item.variant}</p>}
                          </div>
                          <span className="text-white/40 text-xs">x{item.quantity}</span>
                          <span className="text-white font-bold text-xs">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/3 rounded-xl px-4 py-3 text-xs space-y-1">
                    <div className="flex justify-between text-white/40"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-white/40"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</span></div>
                    <div className="flex justify-between text-white/40"><span>Tax</span><span>₹{order.tax.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-white font-bold border-t border-white/5 pt-1 mt-1"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {/* Status update */}
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs font-semibold">Update Status:</span>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white/8 border border-white/10 text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        {ALL_STATUSES.map(s => <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>)}
                      </select>
                    </div>

                    {/* Approve shortcut */}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 text-xs font-bold rounded-xl border border-green-500/20 transition-colors"
                      >
                        <CheckCircle size={13} /> Approve & Ship
                      </button>
                    )}

                    {/* Cancel shortcut */}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-colors"
                      >
                        <XCircle size={13} /> Cancel
                      </button>
                    )}
                  </div>

                  {/* Tracking number input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter / update tracking number..."
                      value={trackingInputs[order.id] ?? ''}
                      onChange={e => setTrackingInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                      className="flex-1 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-white text-xs placeholder-white/20 focus:outline-none focus:border-purple-500/40"
                    />
                    <button
                      onClick={() => handleTrackingSubmit(order.id)}
                      className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <Truck size={13} /> Track
                    </button>
                  </div>

                  {order.notes && (
                    <div className="flex items-start gap-2 text-xs text-yellow-400/70 bg-yellow-500/5 border border-yellow-500/10 rounded-xl px-3 py-2">
                      <AlertCircle size={13} className="mt-0.5 shrink-0" />
                      {order.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-16 text-white/20">
            <p className="text-lg font-semibold">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};
