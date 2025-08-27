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



// types/inventory.ts
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: 'seeds' | 'fertilizers' | 'pesticides' | 'equipment' | 'tools' | 'irrigation' | 'organic' | 'chemicals';
  subcategory?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  reservedQuantity: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  supplierSku?: string;
  location: string;
  zone?: string;
  shelf?: string;
  expiryDate?: string;
  manufacturedDate?: string;
  batchNumber?: string;
  lotNumber?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'expired' | 'damaged' | 'reserved';
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  tags?: string[];
  notes?: string;
  images?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  temperature?: {
    min: number;
    max: number;
  };
  humidity?: {
    min: number;
    max: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'damaged' | 'expired';
  quantity: number;
  reference?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface InventoryFilters {
  category?: string;
  subcategory?: string;
  status?: string;
  condition?: string;
  supplier?: string;
  location?: string;
  search?: string;
  expiringInDays?: number;
  priceRange?: { min: number; max: number };
  tags?: string[];
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  totalCostValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  expiringSoon: number;
  expiredItems: number;
  damagedItems: number;
  categories: Record<string, { count: number; value: number }>;
  topSuppliers: { name: string; items: number; value: number }[];
  recentMovements: StockMovement[];
}
