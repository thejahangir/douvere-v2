import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { analyticsSummary } from '../../data/adminData';
import { products } from '../../data/products';
import {
  TrendingUp, ShoppingCart, Package, Users,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  processing: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const KpiCard: React.FC<{
  title: string;
  value: string;
  growth: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, growth, icon, color }) => (
  <div className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:bg-white/6 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${growth >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(growth)}%
      </span>
    </div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className="text-xs text-white/40 font-medium">{title}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { orders } = useStore();
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const analytics = analyticsSummary;
  const maxRevenue = Math.max(...analytics.revenueByMonth.map(m => m.revenue));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
        <p className="text-white/40 text-sm mt-1">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString('en-IN')}`}
          growth={analytics.revenueGrowth}
          icon={<TrendingUp size={20} className="text-purple-400" />}
          color="bg-purple-500/20"
        />
        <KpiCard
          title="Total Orders"
          value={analytics.totalOrders.toString()}
          growth={analytics.ordersGrowth}
          icon={<ShoppingCart size={20} className="text-pink-400" />}
          color="bg-pink-500/20"
        />
        <KpiCard
          title="Total Products"
          value={`${products.length + 0}`}
          growth={0}
          icon={<Package size={20} className="text-blue-400" />}
          color="bg-blue-500/20"
        />
        <KpiCard
          title="Total Customers"
          value={analytics.totalCustomers.toString()}
          growth={5.3}
          icon={<Users size={20} className="text-green-400" />}
          color="bg-green-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/4 border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Revenue (Last 6 Months)</h3>
          <div className="flex items-end gap-3 h-40">
            {analytics.revenueByMonth.map((point) => (
              <div key={point.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-500 hover:from-purple-500 hover:to-pink-400 cursor-pointer"
                    style={{ height: `${(point.revenue / maxRevenue) * 130}px` }}
                    title={`₹${point.revenue.toLocaleString('en-IN')}`}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    ₹{point.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-[10px] text-white/30 font-medium">{point.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Order Status</h3>
          <div className="space-y-3">
            {Object.entries(analytics.orderStatusBreakdown).map(([status, count]) => {
              const total = Object.values(analytics.orderStatusBreakdown).reduce((a, b) => a + b, 0);
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold capitalize text-white/60">{status}</span>
                    <span className="text-xs font-bold text-white">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Top Products</h3>
            <Link to="/admin/products" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">View all</Link>
          </div>
          <div className="space-y-4">
            {analytics.topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center gap-3">
                <span className="text-xs font-bold text-white/20 w-4">{i + 1}</span>
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">{p.name}</p>
                  <p className="text-[10px] text-white/30">{p.sales} units</p>
                </div>
                <span className="text-xs font-bold text-green-400">₹{p.revenue.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/4 border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-white/30 font-semibold py-2 pr-4">Order</th>
                  <th className="text-left text-white/30 font-semibold py-2 pr-4">Customer</th>
                  <th className="text-left text-white/30 font-semibold py-2 pr-4">Total</th>
                  <th className="text-left text-white/30 font-semibold py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4 font-mono text-white/50">{order.id}</td>
                    <td className="py-3 pr-4 text-white/80 font-medium">{order.customerName}</td>
                    <td className="py-3 pr-4 text-white font-bold">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
