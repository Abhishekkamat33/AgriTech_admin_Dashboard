import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Customer,Order } from '../type/index';
import { Search, Mail, Phone, Trash2, Edit2 } from 'lucide-react';

interface EditFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  userType: 'ADMIN' | 'FARMER' | 'CUSTOMER' | 'GUEST';
}

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    userType: 'CUSTOMER',
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  useEffect(() => {
    // Extract token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!token) {
      console.log('No auth token found');
      return;
    }

    // Fetch customers API
    const fetchCustomers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log('Failed to fetch customers');
        return;
      }
      const data: Customer[] = await res.json();
      // console.log("Fetched customers:", data);
      setCustomers(data);
    };

    // Fetch orders API and aggregate totals
    const fetchOrders = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        console.log('Failed to fetch orders');
        return;
      }
      const orders = await res.json();


      // Aggregate totals into customer objects
      const customerTotals: Record<string, { totalOrders: number; totalSpent: number }> = {};
    orders.forEach((order: Order) => {
  const userId = order.userId;
  if (!customerTotals[userId]) {
    customerTotals[userId] = { totalOrders: 0, totalSpent: 0 };
  }
  customerTotals[userId].totalOrders += 1;
  customerTotals[userId].totalSpent += order.totalPrice || 0;
});


      // Merge totals into customers state
      setCustomers(prev =>
        prev.map(c => ({
          ...c,
          totalOrders: customerTotals[c.userId]?.totalOrders || 0,
          totalSpent: customerTotals[c.userId]?.totalSpent || 0,
        })),
      );
    };

    fetchCustomers();
    fetchOrders();
  }, []);

  // Handler for Delete with confirmation
  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        alert('Failed to delete customer');
        return;
      }
      setCustomers(customers.filter(c => c.userId !== userId));
    } catch{
      console.log('Error deleting customer');
    }
  };

  // Open modal and populate form for edit
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      userType: customer.userType || 'CUSTOMER',
    });
    setShowEditModal(true);
  };

  // Handle form inputs
const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setEditFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};

  // Submit edit form
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];
      const updatedCustomer = {
        ...selectedCustomer,
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${selectedCustomer.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (!res.ok) {
        alert('Failed to update customer');
        return;
      }

      setCustomers((prev) =>
        prev.map((c) => (c.userId === selectedCustomer.userId ? updatedCustomer : c))
      );

      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch {
      console.log('Error updating customer');
    }
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Customers</h2>
            <div className="text-sm text-gray-600">{filteredCustomers.length} customers</div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th> 
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.userId} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-3 w-3 mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-3 w-3 mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.userType}</td> 
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      customer.status.toLowerCase() === 'active' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(customer.registrationDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-4">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      title={`Edit ${customer.name}`}
                      aria-label={`Edit ${customer.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.userId)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title={`Delete ${customer.name}`}
                      aria-label={`Delete ${customer.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <h3 className="text-xl font-semibold mb-4">Edit Customer</h3>
            <form onSubmit={handleEditSubmit} className="space-y-6">
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
      Name
    </label>
    <input
      id="name"
      name="name"
      type="text"
      value={editFormData.name}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
      required
    />
  </div>

  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      value={editFormData.email}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
      required
    />
  </div>

  <div>
    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
      Phone
    </label>
    <input
      id="phone"
      name="phone"
      type="tel"
      value={editFormData.phone}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
    />
  </div>

  <div>
    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
      Address
    </label>
    <input
      id="address"
      name="address"
      type="text"
      value={editFormData.address}
      onChange={handleInputChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
    />
  </div>

  <div>
    <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
      User Type
    </label>
 <select
  id="userType"
  name="userType"
  value={editFormData.userType}
  onChange={handleInputChange}
  className="mt-1 block w-full max-w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm
             focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50 
             dropdown-auto-width"
  required
>
  <option value="">Select user type</option>
  <option value="FARMER">Farmer</option>
  <option value="ADMIN">Admin</option>
  <option value="CUSTOMER">Customer</option>
  <option value="GUEST">Guest</option>
</select>


  </div>

  <div className="flex justify-end space-x-4">
    <button
      type="button"
      onClick={() => setShowEditModal(false)}
      className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
    >
      Save Changes
    </button>
  </div>
</form>

          </div>
        </div>
      )}
    </>
  );
};

export default CustomerList;
