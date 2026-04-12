import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, confirmOrder, rejectOrder, updateOrderPickupDate } from '../../db';
import { Search, Calendar, Inbox, Check, CircleDot, CheckCircle2, XCircle, Loader2, ArrowUpDown, Layers } from 'lucide-react';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchDate, setSearchDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'orderDate', direction: 'desc' });
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [pickupDate, setPickupDate] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredOrders = orders
    .filter(o => {
      const searchMatch = o.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.userId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const localDate = new Date(o.orderDate);
      const localDateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
      const dateMatch = searchDate ? localDateString === searchDate : true;

      const isPending = !o.isConfirmed;
      const isProcessing = o.isConfirmed && o.status !== 'Picked Up';
      const isCompleted = o.status === 'Picked Up';

      let statusMatch = true;
      if (filterStatus === 'Pending') statusMatch = isPending;
      if (filterStatus === 'Processing') statusMatch = isProcessing;
      if (filterStatus === 'Completed') statusMatch = isCompleted;

      return searchMatch && dateMatch && statusMatch;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getHighLevelStatus = (order) => {
    if (!order.isConfirmed) return 'Pending';
    if (order.status === 'Picked Up') return 'Completed';
    return 'Processing';
  };

  const getStatusBadge = (order) => {
    const highLevelStatus = getHighLevelStatus(order);
    
    if (highLevelStatus === 'Pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-warning/10 text-warning border border-warning/20">
          <Loader2 size={12} className="mr-1.5 animate-spin" /> Pending
        </span>
      );
    }
    if (highLevelStatus === 'Processing') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
          <CircleDot size={12} className="mr-1.5" /> Processing ({order.status})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-success/10 text-success border border-success/20">
        <Check size={12} className="mr-1.5" /> Completed
      </span>
    );
  };

  const handleAction = async (action, order) => {
    if (action === 'accept') {
      setAcceptingOrder(order);
    } else if (action === 'reject') {
      await rejectOrder(order.orderId);
      fetchOrders();
    }
  };

  const handleConfirmAccept = async () => {
    if (!acceptingOrder || !pickupDate) {
      alert("Please select a pickup date.");
      return;
    }
    try {
      await updateOrderPickupDate(acceptingOrder.orderId, pickupDate, "");
      await confirmOrder(acceptingOrder.orderId);
      setAcceptingOrder(null);
      setPickupDate('');
      fetchOrders();
    } catch (e) {
      alert("Failed to confirm order.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrders();
  };

  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    
    if (confirm(`Are you sure you want to update ${sortedAndFilteredOrders.length} orders to '${newStatus}'?`)) {
      setIsBulkUpdating(true);
      try {
        // Run updates sequentially to avoid overwhelming localStorage
        for (const order of sortedAndFilteredOrders) {
          if (order.isConfirmed) { // Only update confirmed orders in bulk update
            await updateOrderStatus(order.orderId, newStatus);
          }
        }
        await fetchOrders();
      } catch (error) {
        alert("Failed to update some orders.");
      } finally {
        setIsBulkUpdating(false);
      }
    }
    e.target.value = ""; // reset dropdown
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-sm text-slate-500 mt-1">View, track, and manage all laundry service requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, names..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64 transition-all"
              />
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-48 text-slate-600 transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
              />
            </div>
            
            <div className="relative">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-4 pr-10 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {searchDate && sortedAndFilteredOrders.length > 0 && (
              <div className="relative flex-1 sm:flex-none">
                <select 
                  onChange={handleBulkStatusChange}
                  defaultValue=""
                  disabled={isBulkUpdating}
                  className="pl-4 pr-10 py-2 border-2 border-primary/30 bg-primary/5 text-primary font-semibold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer w-full transition-colors hover:bg-primary/10"
                >
                  <option value="" disabled>Bulk Update Status...</option>
                  <option value="Unpack">Unpack</option>
                  <option value="Washing">Washing</option>
                  <option value="Drying">Drying</option>
                  <option value="Ready for Pickup">Ready for Pickup</option>
                  <option value="Picked Up">Picked Up</option>
                </select>
                {isBulkUpdating && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary" />}
              </div>
            )}
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 whitespace-nowrap hidden sm:block">
              {sortedAndFilteredOrders.length} Orders
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto flex-1 bg-white">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 font-semibold sticky top-0 z-10 border-b border-slate-200 rounded-t-xl">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('orderId')}>
                  <div className="flex items-center gap-1">Order ID <ArrowUpDown size={12} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('userId')}>
                  <div className="flex items-center gap-1">Student Name <ArrowUpDown size={12} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4">Enrollment Number</th>
                <th className="px-6 py-4 max-w-[150px]">Clothes Type</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('orderDate')}>
                  <div className="flex items-center gap-1">Order Date <ArrowUpDown size={12} className="text-slate-400" /></div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-24 text-center text-slate-400 tracking-wide">
                    <div className="flex justify-center items-center gap-2">
                       <Loader2 size={18} className="animate-spin text-primary" /> Loading orders...
                    </div>
                  </td>
                </tr>
              ) : sortedAndFilteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                         <Inbox size={28} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium tracking-wide">No orders match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredOrders.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const clothesTypes = order.items.map(i => i.name).join(', ');
                  const highLevelStatus = getHighLevelStatus(order);

                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-semibold text-slate-800">{order.orderId}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{order.username || order.userEmail || order.userId}</td>
                      <td className="px-6 py-4 text-slate-500">{order.enrollmentNumber}</td>
                      <td className="px-6 py-4">
                        <div className="truncate max-w-[160px] text-slate-600" title={clothesTypes}>
                          {clothesTypes || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200">
                          {totalItems}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {highLevelStatus === 'Pending' ? (
                            <>
                              <button 
                                onClick={() => handleAction('accept', order)}
                                className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors"
                                title="Accept Order"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleAction('reject', order)}
                                className="p-1.5 text-danger hover:bg-red-50 rounded-md transition-colors"
                                title="Reject Order"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <div className="relative">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                className="pl-3 pr-8 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                              >
                                <option value="Unpack">Unpack</option>
                                <option value="Washing">Washing</option>
                                <option value="Drying">Drying</option>
                                <option value="Ready for Pickup">Ready</option>
                                <option value="Picked Up">Picked Up</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-900">{sortedAndFilteredOrders.length}</span> entries
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-md bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 text-sm border border-slate-200 rounded-md bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
      
      {acceptingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
           <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Accept Order</h3>
              <p className="text-sm text-slate-500 mb-4">Set the expected pickup date for <span className="font-mono">{acceptingOrder.orderId}</span>.</p>
              <input 
                type="date"
                value={pickupDate}
                required
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-5"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => { setAcceptingOrder(null); setPickupDate(''); }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmAccept}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Confirm & Accept
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
