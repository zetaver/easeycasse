import React, { useState } from 'react';
import { Search, Package, Truck, MapPin, AlertCircle } from 'lucide-react';

const TrackOrder = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState<null | {
    status: string;
    location: string;
    lastUpdate: string;
    estimatedDelivery: string;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual tracking lookup
    setOrderStatus({
      status: 'In Transit',
      location: 'Paris Distribution Center',
      lastUpdate: '2024-03-10 14:30',
      estimatedDelivery: '2024-03-12',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Keep dark */}
      <div className="bg-[#2A2B32] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Package className="w-16 h-16 text-[#FFB800] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your shipment
          </p>
        </div>
      </div>

      {/* Tracking Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tracking" className="block text-sm font-medium text-gray-700">
                Tracking Number
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white border border-gray-300 rounded-md 
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800]"
                  placeholder="Enter your tracking number"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium 
                       text-white bg-[#FFB800] hover:bg-[#FFA000] transition-colors
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB800]"
            >
              Track Package
            </button>
          </form>
        </div>
      </div>

      {/* Tracking Result */}
      {orderStatus && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Shipment Status</h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FFB800] text-white">
                  {orderStatus.status}
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#FFB800] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Current Location</p>
                    <p className="text-sm text-gray-600">{orderStatus.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Truck className="w-5 h-5 text-[#FFB800] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-gray-600">{orderStatus.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-[#FFB800] mt-1" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Last Update</p>
                    <p className="text-sm text-gray-600">{orderStatus.lastUpdate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Timeline */}
            <div className="border-t border-gray-200 px-6 py-4">
              <h3 className="text-sm font-medium text-gray-900">Shipment Timeline</h3>
              <div className="mt-4 space-y-6">
                <div className="relative">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-[#FFB800]"></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Package in transit</p>
                      <p className="text-sm text-gray-600">Paris Distribution Center</p>
                      <p className="text-xs text-gray-500">March 10, 2024 14:30</p>
                    </div>
                  </div>
                </div>
                {/* Add more timeline items as needed */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions about your shipment or need assistance, our customer service team is here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                           text-white bg-[#FFB800] hover:bg-[#FFA000] transition-colors">
              Contact Support
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium 
                           rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              View FAQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;