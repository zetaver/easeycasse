import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Eye, Download, RefreshCw, AlertCircle, BarChart2, Trash2, X } from 'lucide-react';
import { API_URL } from '../../config';
import { useTranslation } from 'react-i18next';

interface OrderItem {
  product: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    category?: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  buyer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  seller: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    storeName?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderCounts {
  totalCount: number;
  statusCounts: {
    [key: string]: number;
  };
  paymentStatusCounts: {
    [key: string]: number;
  };
  sellerCounts: {
    seller: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      storeName?: string;
    };
    count: number;
  }[];
}

const SellerOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCounts, setOrderCounts] = useState<OrderCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCountsLoading, setIsCountsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchOrderCounts();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');

      let url = `${API_URL}/api/orders/admin/all`;
      
      // Add query parameters if filters are set
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (sellerFilter) params.append('sellerId', sellerFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(t('admin.sellerOrders.errors.fetchFailed', { status: response.status }));
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || t('admin.sellerOrders.errors.fetchFailed'));
      }

      setOrders(data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(t('admin.sellerOrders.errors.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderCounts = async () => {
    try {
      setIsCountsLoading(true);

      const response = await fetch(`${API_URL}/api/orders/admin/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(t('admin.sellerOrders.errors.fetchCountsFailed', { status: response.status }));
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || t('admin.sellerOrders.errors.fetchCountsFailed'));
      }

      setOrderCounts(data);
    } catch (error) {
      console.error('Error fetching order counts:', error);
    } finally {
      setIsCountsLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchOrders();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    // Filter by search query (check order ID, buyer name, seller name, or email)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const orderId = order._id.toLowerCase();
      const buyerName = `${order.buyer.firstName} ${order.buyer.lastName}`.toLowerCase();
      const buyerEmail = order.buyer.email.toLowerCase();
      const sellerName = `${order.seller.firstName} ${order.seller.lastName}`.toLowerCase();
      const sellerEmail = order.seller.email.toLowerCase();
      const storeName = order.seller.storeName?.toLowerCase() || '';
      
      return orderId.includes(query) || 
             buyerName.includes(query) || 
             buyerEmail.includes(query) ||
             sellerName.includes(query) ||
             sellerEmail.includes(query) ||
             storeName.includes(query);
    }
    
    return true;
  });

  const deleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      setDeleteSuccess(false);

      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(t('admin.sellerOrders.errors.deleteFailed', { status: response.status }));
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || t('admin.sellerOrders.errors.deleteFailed'));
      }

      // Remove the order from the local state
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
      // Update order counts
      fetchOrderCounts();
      
      setDeleteSuccess(true);
      
      // Close the modal after a short delay
      setTimeout(() => {
        setShowDeleteModal(false);
        setOrderToDelete(null);
        setDeleteSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Error deleting order:', error);
      setDeleteError(t('admin.sellerOrders.errors.deleteFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (order: Order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
    setDeleteError('');
    setDeleteSuccess(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-semibold text-gray-900">{t('admin.sellerOrders.title')}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              fetchOrders();
              fetchOrderCounts();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            {t('admin.sellerOrders.refreshData')}
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.sellerOrders.stats.totalOrders')}</h3>
          {isCountsLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-emerald-600">{orderCounts?.totalCount || 0}</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.sellerOrders.stats.pendingOrders')}</h3>
          {isCountsLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-yellow-600">{orderCounts?.statusCounts?.pending || 0}</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.sellerOrders.stats.completedPayments')}</h3>
          {isCountsLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-green-600">{orderCounts?.paymentStatusCounts?.completed || 0}</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.sellerOrders.stats.activeSellers')}</h3>
          {isCountsLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-blue-600">{orderCounts?.sellerCounts?.length || 0}</p>
          )}
        </div>
      </div>

      {/* Seller Statistics */}
      {!isCountsLoading && orderCounts?.sellerCounts && orderCounts.sellerCounts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">{t('admin.sellerOrders.sellerDistribution')}</h2>
          <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.seller')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.storeName')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.email')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.orderCount')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderCounts.sellerCounts.map((item) => (
                  <tr key={item.seller._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.seller.firstName} {item.seller.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.seller.storeName || t('admin.sellerOrders.noStoreName')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.seller.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-emerald-600 hover:text-emerald-900"
                        onClick={() => {
                          setSellerFilter(item.seller._id);
                          handleFilterChange();
                        }}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('admin.sellerOrders.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select 
          className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">{t('admin.sellerOrders.filters.allStatus')}</option>
          <option value="pending">{t('admin.sellerOrders.status.pending')}</option>
          <option value="processing">{t('admin.sellerOrders.status.processing')}</option>
          <option value="shipped">{t('admin.sellerOrders.status.shipped')}</option>
          <option value="delivered">{t('admin.sellerOrders.status.delivered')}</option>
          <option value="cancelled">{t('admin.sellerOrders.status.cancelled')}</option>
        </select>
        {sellerFilter && (
          <button
            onClick={() => {
              setSellerFilter('');
              handleFilterChange();
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            {t('admin.sellerOrders.clearSellerFilter')}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-500">{t('admin.sellerOrders.loading')}</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.orderId')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.seller')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.customer')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.date')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.total')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.payment')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.sellerOrders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p className="font-medium">{order.seller.firstName} {order.seller.lastName}</p>
                        <p className="text-xs text-gray-400">{order.seller.storeName || t('admin.sellerOrders.noStoreName')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <p className="font-medium">{order.buyer.firstName} {order.buyer.lastName}</p>
                        <p className="text-xs text-gray-400">{order.buyer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                        {t(`admin.sellerOrders.status.${order.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeColor(order.paymentStatus)}`}>
                        {t(`admin.sellerOrders.paymentStatus.${order.paymentStatus.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                       
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteModal(order)}
                          title={t('admin.sellerOrders.deleteOrder')}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('admin.sellerOrders.noOrdersFound')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter || sellerFilter
                  ? t('admin.sellerOrders.adjustFilters')
                  : t('admin.sellerOrders.noOrdersInSystem')}
              </p>
            </div>
          )}
        </div>

        {/* Pagination - simplified for now */}
        {filteredOrders.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('admin.sellerOrders.showingOrders', { count: filteredOrders.length })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Order Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">{t('admin.sellerOrders.modals.delete.title')}</h3>
              <button 
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('admin.sellerOrders.modals.delete.confirmation')}</p>
              <p className="text-sm text-gray-500 mb-2">{t('admin.sellerOrders.modals.delete.orderId')}: {orderToDelete._id.substring(0, 8).toUpperCase()}</p>
              <p className="text-sm text-gray-500 mb-2">{t('admin.sellerOrders.modals.delete.customer')}: {orderToDelete.buyer.firstName} {orderToDelete.buyer.lastName}</p>
              <p className="text-sm text-gray-500 mb-2">{t('admin.sellerOrders.modals.delete.seller')}: {orderToDelete.seller.firstName} {orderToDelete.seller.lastName}</p>
              <p className="text-sm text-gray-500 mb-4">{t('admin.sellerOrders.modals.delete.total')}: ${orderToDelete.totalAmount.toFixed(2)}</p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {t('admin.sellerOrders.modals.delete.warning')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {deleteError}
              </div>
            )}
            
            {deleteSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {t('admin.sellerOrders.modals.delete.success')}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 mr-3"
                disabled={isDeleting}
              >
                {t('admin.sellerOrders.modals.delete.cancel')}
              </button>
              <button
                type="button"
                onClick={() => deleteOrder(orderToDelete._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting || deleteSuccess}
              >
                {isDeleting ? t('admin.sellerOrders.modals.delete.deleting') : t('admin.sellerOrders.modals.delete.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders; 