'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, Legend
} from 'recharts';
import {
  TrendingUp, DollarSign, Users, Package, ShoppingCart, Activity, Target,
  Star, RefreshCw, Bell, Truck, Clock, CheckCircle, XCircle, AlertTriangle,
  AlertCircle, CreditCard, Download, Filter, Settings, Eye, ArrowUpRight,
  ArrowDownRight, Calendar, MapPin, Award, Zap, BarChart3
} from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#84cc16'];

type FilterValue = 'all' | string;

interface Filters {
  category: FilterValue;
  userType: FilterValue;
  paymentMethod: FilterValue;
  status: FilterValue;
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'products' | 'customers' | 'operations'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    userType: 'all',
    paymentMethod: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = typeof document !== 'undefined'
          ? document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1]
          : undefined;

        if (!token) throw new Error('No auth token found');

        const [productsRes, ordersRes, usersRes, paymentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (![productsRes, ordersRes, usersRes, paymentsRes].every(res => res.ok)) {
          throw new Error('Failed to fetch one or more datasets');
        }

        const [products, orders, users, payments] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          usersRes.json(),
          paymentsRes.json(),
        ]);

        setDashboardData({ products, orders, users, payments });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    if (!dashboardData) return null;

    let products = dashboardData.products;
    let users = dashboardData.users;
    let payments = dashboardData.payments;
    let orders = dashboardData.orders;

    if (filters.category !== 'all')
      products = products.filter((p: any) => p.category?.categoryName === filters.category);
    if (filters.userType !== 'all')
      users = users.filter((u: any) => u.userType === filters.userType);
    if (filters.paymentMethod !== 'all')
      payments = payments.filter((p: any) => p.paymentMethod === filters.paymentMethod);
    if (filters.status !== 'all')
      orders = orders.filter((o: any) => o.status === filters.status);

    return { ...dashboardData, products, users, payments, orders };
  }, [dashboardData, filters]);

  // Data processing functions
  const getCategoryDistribution = () => {
    if (!filteredData) return [];
    const categoryCount: Record<string, number> = {};
    filteredData.products.forEach((product: any) => {
      const category = product.category?.categoryName || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  const getOrderStatusDistribution = () => {
    if (!filteredData) return [];
    const statusCount: Record<string, number> = {};
    filteredData.orders.forEach((order: any) => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const getPaymentMethodDistribution = () => {
    if (!filteredData) return [];
    const methodCount: Record<string, number> = {};
    filteredData.payments.forEach((payment: any) => {
      methodCount[payment.paymentMethod] = (methodCount[payment.paymentMethod] || 0) + 1;
    });
    return Object.entries(methodCount).map(([name, value]) => ({ name, value }));
  };

  const getUserTypeDistribution = () => {
    if (!filteredData) return [];
    const typeCount: Record<string, number> = {};
    filteredData.users.forEach((user: any) => {
      typeCount[user.userType] = (typeCount[user.userType] || 0) + 1;
    });
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };

  const getMonthlyRevenue = () => {
    if (!filteredData) return [];
    const monthlyData: Record<string, number> = {};
    filteredData.payments
      .filter((p: any) => p.paymentStatus === 'COMPLETED')
      .forEach((payment: any) => {
        const date = new Date(payment.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + payment.amount;
      });
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));
  };

  const getDailySales = () => {
    if (!filteredData) return [];
    const dailyData: Record<string, { date: string; orders: number; revenue: number }> = {};

    filteredData.orders.forEach((order: any) => {
      const date = order.orderDate.split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, orders: 0, revenue: 0 };
      }
      dailyData[date].orders += 1;
      dailyData[date].revenue += order.totalPrice;
    });

    return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (loading || !filteredData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto" />
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading advanced analytics...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = filteredData.payments
    .filter((p: any) => p.paymentStatus === 'COMPLETED')
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const activeUsers = filteredData.users.filter((u: any) => u.status === 'ACTIVE').length;
  const conversionRate = activeUsers > 0 ? ((filteredData.orders.length / activeUsers) * 100) : 0;
  const avgOrderValue = filteredData.orders.length > 0 ? (totalRevenue / filteredData.orders.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">Comprehensive business intelligence and insights</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={DollarSign}
            gradient="from-green-500 to-emerald-600"
            change={12.5}
          />
          <MetricCard
            title="Total Orders"
            value={filteredData.orders.length.toLocaleString()}
            icon={ShoppingCart}
            gradient="from-blue-500 to-indigo-600"
            change={8.2}
          />
          <MetricCard
            title="Active Users"
            value={activeUsers.toLocaleString()}
            icon={Users}
            gradient="from-purple-500 to-violet-600"
            change={-2.1}
          />
          <MetricCard
            title="Products"
            value={filteredData.products.length.toLocaleString()}
            icon={Package}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate.toFixed(2)}%`}
            icon={Target}
            gradient="from-teal-500 to-cyan-600"
            change={5.3}
          />
          <MetricCard
            title="Avg Order Value"
            value={`₹${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={TrendingUp}
            gradient="from-pink-500 to-rose-600"
            change={7.8}
          />
          <MetricCard
            title="Payment Success Rate"
            value={`${((filteredData.payments.filter((p: any) => p.paymentStatus === 'COMPLETED').length / filteredData.payments.length) * 100).toFixed(1)}%`}
            icon={CheckCircle}
            gradient="from-indigo-500 to-purple-600"
            change={1.2}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Trend */}
          <ChartCard title="Monthly Revenue Trend" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getMonthlyRevenue()}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Category Distribution */}
          <ChartCard title="Product Categories" icon={Package}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryDistribution()}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${percent !== undefined ? (percent * 100).toFixed(0) + '%' : ''
                    }`
                  }

                >
                  {getCategoryDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Daily Sales Performance */}
        <ChartCard title="Daily Sales Performance" icon={BarChart3} className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={getDailySales()}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: any, name: string) => [
                name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#6366f1" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} name="Revenue" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bottom Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status Distribution */}
          <ChartCard title="Order Status" icon={Activity}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getOrderStatusDistribution()} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Payment Methods */}
          <ChartCard title="Payment Methods" icon={CreditCard}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getPaymentMethodDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getPaymentMethodDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* User Types */}
          <ChartCard title="User Types" icon={Users}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getUserTypeDistribution()}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.FC<any>;
  gradient: string;
  change?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, gradient, change }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {typeof change === 'number' && (
        <div className="flex items-center">
          {change >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  icon: React.FC<any>;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 ${className}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

export default EnhancedAnalyticsDashboard;
