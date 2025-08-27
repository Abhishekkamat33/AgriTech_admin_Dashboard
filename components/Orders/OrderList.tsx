import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter } from 'lucide-react';
import { Order } from '../../type/index';


interface OrderListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  fetchUserById: (userId: number) => Promise<{ name: string; email: string }>;
  fetchProductById: (productId: number) => Promise<{ name: string }>;
  fetchPaymentById: (paymentId: number) => Promise<{
    paymentId: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
    transactionId: string;
    amount: number;
  }>;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewOrder,
  fetchUserById,
  fetchProductById,
  fetchPaymentById,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [enrichedOrders, setEnrichedOrders] = useState<Order[]>([]);

  useEffect(() => {
    const enrichOrders = async () => {
      const enriched = await Promise.all(
        orders.map(async (order) => {
          const user = await fetchUserById(order.userId).catch(() => ({ name: 'Unknown', email: '' }));
          const payment = await fetchPaymentById(order.paymentId).catch(() => ({
            paymentId: order.paymentId,
            paymentMethod: 'Unknown',
            paymentStatus: 'Unknown',
            paymentDate: '',
            transactionId: '',
            amount: 0,
          }));


          console.log('Order:', order);
          const enrichedDetails = await Promise.all(
            order.orderDetails.map(async (item) => {
              const product = await fetchProductById(item.productId).catch(() => ({ name: 'Unknown Product' }));
              return { ...item, productName: product.name };
            }),
          );
          return {
            ...order,
            customerName: user.name,
            customerEmail: user.email,
            payment: payment,
            orderDetails: enrichedDetails,
          };
        }),
      );
      setEnrichedOrders(enriched);
    };

    enrichOrders();
  }, [orders, fetchUserById, fetchProductById, fetchPaymentById]);

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  const filteredOrders = enrichedOrders.filter((order) => {
    const matchesSearch =
      order.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus =
      selectedStatus === '' || order.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  console.log('Enriched Orders:', filteredOrders);

  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredOrders.length} orders</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Order List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>

              {/* New Payment columns */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Date</th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.orderId?.toString()} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.orderId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.orderDetails.length} item{order.orderDetails.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.orderDetails.map((item) => item.productName || 'Loading...').join(', ').slice(0, 30)}
                    {order.orderDetails.map((item) => item.productName || 'Loading...').join(', ').length > 30 ? '...' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">₹{order?.totalPrice?.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.orderDate)}
                </td>

                {/* Payment columns */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.payment?.paymentMethod || 'Loading...'}
                </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.payment?.amount || 'Loading...'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.payment?.paymentStatus?.toLowerCase() === 'completed'
                      ? 'text-green-600 bg-green-100'
                      : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    {order.payment?.paymentStatus || 'Loading...'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.payment?.paymentDate ? formatDate(order.payment.paymentDate) : 'Loading...'}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
