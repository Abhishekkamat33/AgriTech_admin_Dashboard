import { Product, Order, Customer, DashboardStats } from '../type/index';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Fertilizer Premium',
    description: 'High-quality organic fertilizer for enhanced crop yield',
    price: 850,
    category: {
      categoryId: 'CAT-001'
    },
    stock: 150,
    image: 'https://images.pexels.com/photos/4505457/pexels-photo-4505457.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'PUBLISHED',
    manufacturer:{
      manufacturerId: 'MAN-001'
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Smart Irrigation System',
    description: 'Automated irrigation system with IoT sensors',
    price: 25000,
    category: {
      categoryId: 'CAT-002'
    },
    stock: 25,
    image: 'https://images.pexels.com/photos/4505734/pexels-photo-4505734.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'PUBLISHED',
  manufacturer:{
    manufacturerId: 'MAN-002'
  }
  ,
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Hybrid Tomato Seeds',
    description: 'High-yield hybrid tomato seeds suitable for all seasons',
    price: 120,
  category: 
  {
    categoryId: 'CAT-003'
  },
    stock: 500,
    image: 'https://images.pexels.com/photos/4505896/pexels-photo-4505896.jpeg?auto=compress&cs=tinysrgb&w=300',
    status: 'PUBLISHED',
   manufacturer:{
    manufacturerId: 'MAN-003'
   },
    createdAt: '2024-01-08'
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'CUST-001',
    customerName: 'Ramesh Kumar',
    customerEmail: 'ramesh@email.com',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Organic Fertilizer Premium',
        quantity: 2,
        price: 850
      }
    ],
    total: 1700,
    status: 'delivered',
    createdAt: '2024-01-20',
    shippingAddress: 'Village Khatana, District Panipat, Haryana - 132103'
  },
  {
    id: 'ORD-002',
    customerId: 'CUST-002',
    customerName: 'Sunita Devi',
    customerEmail: 'sunita@email.com',
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'Smart Irrigation System',
        quantity: 1,
        price: 25000
      },
      {
        id: '2',
        productId: '3',
        productName: 'Hybrid Tomato Seeds',
        quantity: 5,
        price: 120
      }
    ],
    total: 25600,
    status: 'processing',
    createdAt: '2024-01-19',
    shippingAddress: 'Gram Sultanpur, Tehsil Rohtak, Haryana - 124001'
  },
  {
    id: 'ORD-003',
    customerId: 'CUST-003',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram@email.com',
    items: [
      {
        id: '1',
        productId: '4',
        productName: 'Bio-Pesticide Spray',
        quantity: 3,
        price: 450
      }
    ],
    total: 1350,
    status: 'shipped',
    createdAt: '2024-01-18',
    shippingAddress: 'Village Dhani Phogat, District Hisar, Haryana - 125001'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ramesh Kumar',
    email: 'ramesh@email.com',
    phone: '+91 9876543210',
    address: 'Village Khatana, District Panipat, Haryana - 132103',
    totalOrders: 15,
    totalSpent: 25500,
    status: 'active',
    createdAt: '2023-08-15'
  },
  {
    id: 'CUST-002',
    name: 'Sunita Devi',
    email: 'sunita@email.com',
    phone: '+91 9765432101',
    address: 'Gram Sultanpur, Tehsil Rohtak, Haryana - 124001',
    totalOrders: 8,
    totalSpent: 18200,
    status: 'active',
    createdAt: '2023-09-22'
  },
  {
    id: 'CUST-003',
    name: 'Vikram Singh',
    email: 'vikram@email.com',
    phone: '+91 9654321012',
    address: 'Village Dhani Phogat, District Hisar, Haryana - 125001',
    totalOrders: 12,
    totalSpent: 32100,
    status: 'active',
    createdAt: '2023-07-10'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalRevenue: 285600,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 45,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  productsGrowth: 6.7
};