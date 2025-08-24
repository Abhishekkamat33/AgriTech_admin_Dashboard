import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, DollarSign, Users, Package, ShoppingCart,
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface Payment {
  paymentId: string;
  userId: string;
  amount: number;
  paymentStatus: string;
  paymentMethod: string;
}

interface OrderDetail {
  productId: string;
}

interface Order {
  orderId: string;
  userId: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  paymentId: string;
  orderDetails: OrderDetail[];
}

interface User {
  userId: string;
  name: string;
  status: string;
  userType: string;
}

interface Product {
  productId: string;
  name: string;
  category?: { categoryName: string };
}

interface DashboardData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    avgOrderValue: number;
    conversionRate: number;
  };
  recentOrders: Array<{
    orderId: string;
    customerName: string;
    date: string;
    amount: number;
    status: string;
    paymentMethod: string;
  }>;
  productPerformance: Array<{
    name: string;
    category: string;
    sales: number;
    revenue: number;
    margin: number;
  }>;
  userTypes: Array<{ name: string; count: number; value: number }>;
  paymentMethods: Array<{ name: string; count: number; value: number }>;
  salesTrend: Array<{ date: string; revenue: number; orders: number }>;
  categoryPerformance: Array<{ category: string; revenue: number; orders: number }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const processBackendData = (
    products: Product[],
    orders: Order[],
    users: User[],
    payments: Payment[],
  ): DashboardData => {
    // Calculations similar to your earlier logic, adapted to the typed data

    const totalRevenue = payments
      .filter((p) => p.paymentStatus === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalOrders = orders.length;
    const totalUsers = users.filter((u) => u.status === 'ACTIVE').length;
    const totalProducts = products.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    const recentOrders = orders
      .slice(-5)
      .reverse()
      .map((order) => {
        const user = users.find((u) => u.userId === order.userId);
        const payment = payments.find((p) => p.paymentId === order.paymentId);
        return {
          orderId: order.orderId,
          customerName: user?.name ?? 'Unknown',
          date: order.orderDate,
          amount: order.totalPrice,
          status: order.status,
          paymentMethod: payment?.paymentMethod ?? 'N/A',
        };
      });

    // Product performance calculation
    const productPerformance = products.map((product) => {
      const productOrders = orders.filter((order) =>
        order.orderDetails.some((od) => od.productId === product.productId),
      );
      const sales = productOrders.length;
      const revenue = productOrders.reduce((sum, o) => sum + o.totalPrice, 0);

      return {
        name: product.name,
        category: product.category?.categoryName ?? 'Uncategorized',
        sales,
        revenue,
        margin: revenue * 0.1,
      };
    });

    // User types aggregation
    const userTypeCounts = users.reduce<Record<string, number>>((acc, user) => {
      acc[user.userType] = (acc[user.userType] || 0) + 1;
      return acc;
    }, {});
    const userTypes = Object.entries(userTypeCounts).map(([name, count]) => ({
      name,
      count,
      value: (count / totalUsers) * 100,
    }));

    // Payment methods aggregation
    const paymentMethodCounts = payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      return acc;
    }, {});
    const paymentMethods = Object.entries(paymentMethodCounts).map(([name, count]) => ({
      name,
      count,
      value: (count / payments.length) * 100,
    }));

    // Sales trend by date
    const salesTrendMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    orders.forEach((order) => {
      const date = order.orderDate.split('T')[0];
      if (!salesTrendMap[date]) salesTrendMap[date] = { date, revenue: 0, orders: 0 };
      salesTrendMap[date].revenue += order.totalPrice;
      salesTrendMap[date].orders += 1;
    });
    const salesTrend = Object.values(salesTrendMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Category performance aggregation
    const categoryMap: Record<string, { category: string; revenue: number; orders: number }> = {};
    products.forEach((product) => {
      const catName = product.category?.categoryName ?? 'Uncategorized';
      if (!categoryMap[catName]) categoryMap[catName] = { category: catName, revenue: 0, orders: 0 };

      const relatedOrders = orders.filter((order) =>
        order.orderDetails.some((od) => od.productId === product.productId),
      );
      categoryMap[catName].revenue += relatedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      categoryMap[catName].orders += relatedOrders.length;
    });
    const categoryPerformance = Object.values(categoryMap);

    return {
      overview: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        avgOrderValue,
        conversionRate,
      },
      recentOrders,
      productPerformance,
      userTypes,
      paymentMethods,
      salesTrend,
      categoryPerformance,
    };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('authToken='))
          ?.split('=')[1];

        const [productsRes, ordersRes, usersRes, paymentsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [products, orders, users, payments] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          usersRes.json(),
          paymentsRes.json(),
        ]);

        setDashboardData(processBackendData(products, orders, users, payments));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading analytics data...</p>
      </div>
    );
  }

  const {
    overview,
    recentOrders,
    productPerformance,
    userTypes,
    paymentMethods,
    salesTrend,
    categoryPerformance,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Adhunikethi Agritech Analytics</h1>

        <div className="flex item-center flex-wrap gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${overview.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={overview.totalOrders.toString()}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={overview.totalUsers.toString()}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Products"
            value={overview.totalProducts.toString()}
            icon={Package}
            color="orange"
          />
          <StatCard
            title="Conversion Rate"
            value={`${overview.conversionRate.toFixed(2)}%`}
            icon={TrendingUp}
            color="teal"
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${overview.avgOrderValue.toFixed(2)}`}
            icon={DollarSign}
            color="indigo"
          />
        </div>

        {/* Sales Trend Area Chart */}
        <ChartCard title="Sales Trend (Revenue, Orders)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.15}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.15}
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Performance Bar Chart */}
        <ChartCard title="Category Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value: number, name: string) =>
                name === 'revenue'
                  ? `₹${value.toLocaleString()}`
                  : value.toString()
              } />
              <Bar dataKey="revenue" fill="#3B82F6" />
              <Bar dataKey="orders" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Methods Pie Chart */}
        <ChartCard title="Payment Methods">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                dataKey="count"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
              >
                {paymentMethods.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Types Pie Chart */}
        <ChartCard title="User Types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userTypes}
                dataKey="count"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100).toFixed(0)}%`
                }
              >
                {userTypes.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: 'green' | 'blue' | 'purple' | 'orange' | 'teal' | 'indigo';
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  };

  return (
    <div className={`p-5 rounded-lg shadow flex items-center space-x-4 border border-gray-100 bg-white`}>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-8">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

export default AnalyticsDashboard;
