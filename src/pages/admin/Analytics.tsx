import React from 'react';
import { BarChart as BarChartIcon, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const Analytics = () => {
  const stats = [
    {
      name: 'Total Revenue',
      value: '€45,231',
      change: '+20.1%',
      changeType: 'increase',
      icon: DollarSign,
    },
    {
      name: 'Active Users',
      value: '2,345',
      change: '+15.3%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Orders',
      value: '567',
      change: '+12.5%',
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: '+2.4%',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <div className="flex space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div className="text-gray-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <BarChartIcon className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart placeholder</span>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Orders Overview</h2>
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <BarChartIcon className="w-12 h-12 text-gray-400" />
            <span className="ml-2 text-gray-500">Chart placeholder</span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{item}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Product {item}</p>
                    <p className="text-sm text-gray-500">{100 - item * 10} sales</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">€{(1000 - item * 100).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Demographics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Demographics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Age 18-24</span>
              <span className="text-sm font-medium text-gray-900">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Age 25-34</span>
              <span className="text-sm font-medium text-gray-900">40%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Age 35-44</span>
              <span className="text-sm font-medium text-gray-900">20%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', percentage: 35 },
              { source: 'Organic Search', percentage: 25 },
              { source: 'Referral', percentage: 20 },
              { source: 'Social Media', percentage: 15 },
              { source: 'Email', percentage: 5 },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">{item.source}</span>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;