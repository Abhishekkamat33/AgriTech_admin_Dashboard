'use client'
import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import AnalyticsDashboard from '@/components/Analytics';
import Dashboard from '../components/finaldashboard';
import CustomerList from '@/components/CustomersList';
import Products from '@/components/Products/products';
import Settings from '@/components/Settings';
import Orders from '@/components/Orders/orders';
import InventoryDashboard from '@/components/InventoryLab';



function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <CustomerList/>;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <Settings />;
      case 'inventory':
        return <InventoryDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />  
        <div className="max-w-7xl mx-auto  ml-64">
          {renderContent()}
        </div>
    </div>
  );
}

export default App;