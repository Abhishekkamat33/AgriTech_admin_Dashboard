export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: {
    categoryId: string;
  };
  stock: number;
  image: string;
  status: 'PUBLISHED' | 'UNPUBLISHED';
  manufacturer:{
    manufacturerId: string
  },
  createdAt: string;
}

export interface Payment {
  amount: number;
  paymentDate: string;
  paymentId: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
}

export interface OrderItem {
  orderDetailsId: number;
  orderId: number;
  price: number;
  productId: number;
  productName: string;
  quantity: number;
}

export interface Order {
  comment: string | null;
  customerEmail: string;
  customerName: string;
  orderDate: string;
  orderDetails: OrderItem[];
  orderId: number;
  payment: Payment;
  paymentId: number;
  shippingId: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  userId: number;
}


export interface Customer {
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
 registrationDate: string;
 userType:'ADMIN' | 'FARMER' | 'CUSTOMER';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
}