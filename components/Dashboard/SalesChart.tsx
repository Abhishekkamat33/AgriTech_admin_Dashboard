import React from 'react';

const SalesChart: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Apr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 },
  ];

  const maxSales = Math.max(...monthlyData.map(d => d.sales));

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
      <div className="h-64 flex items-end justify-between space-x-2">
        {monthlyData.map((data, index) => {
          const height = (data.sales / maxSales) * 100;
          
          return (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <div className="text-xs text-gray-600 mb-2">₹{(data.sales / 1000).toFixed(0)}K</div>
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-md transition-all duration-700 hover:from-green-600 hover:to-green-500"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-2">{data.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;