'use client';
import React, { useEffect, useState } from 'react';
import OrderList from '../../components/Orders/OrderList';
import OrderModal from '../../components/Orders/OrderModal';
import { Order } from '../../type/index';
// import { connectWebSocket, disconnectWebSocket } from '../websocket';

// Dummy fetch functions; replace with your real API calls
async function fetchUserById(userId: number) {
   const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('User fetch failed');
  return await res.json(); // {name, email}
}

async function fetchProductById(productId: number) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Product fetch failed');
  const product = await res.json(); // {name}
  return product;
}


async function fetchPaymentById(paymentId: number) {
   const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Payment fetch failed');
  const payment = await res.json();
  return payment; // expects { amount, method, status }

}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract token once
  const token = typeof document !== 'undefined'
    ? document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1]
    : undefined;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data: Order[] = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch {
        console.log('Error fetching orders:');
      }
        finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [token]);



  //  const [users, setUsers] = useState([]);




  console.log("Orders state:", orders);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) return <div>Loading orders...</div>;
  if (!token) return <div>Please login to view orders.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders and fulfillment</p>
      </div>

      <OrderList
        orders={orders}
        onViewOrder={handleViewOrder}
        fetchUserById={fetchUserById}
        fetchProductById={fetchProductById}
        fetchPaymentById={fetchPaymentById}
      />

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;
