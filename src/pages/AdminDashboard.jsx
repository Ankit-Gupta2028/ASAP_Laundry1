import { useState, useEffect } from 'react';
import { getAllOrders, confirmOrder, rejectOrder, updateOrderStatus, updateOrderPickupDate } from '../db';
import { Check, X, Search, Calendar, ChevronDown, Package } from 'lucide-react';
import './AdminDashboard.css';

const STATUS_STAGES = ['Unpack', 'Washing', 'Drying', 'Ironing', 'Ready for Pickup', 'Picked Up'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'orders'
  
  // Search state
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  // Bulk state
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState(STATUS_STAGES[0]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = orders.filter(o => !o.isConfirmed);
  
  // Confirmed orders matching search criteria
  const confirmedOrders = orders.filter(o => {
    if (!o.isConfirmed) return false;
    const matchEnrollment = o.enrollmentNumber.toLowerCase().includes(searchEnrollment.toLowerCase());
    
    // Fix date search to use local time instead of UTC to avoid off-by-one-day errors
    const localDate = new Date(o.orderDate);
    const localDateString = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    const matchDate = searchDate ? localDateString === searchDate : true;
    
    return matchEnrollment && matchDate;
  });

  const handleConfirm = async (id) => {
    await confirmOrder(id);
    await fetchData();
  };

  const handleReject = async (id) => {
    if (confirm("Are you sure you want to reject this request?")) {
      await rejectOrder(id);
      await fetchData();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    await fetchData(); // simple refresh
  };

  const handlePickupDateChange = async (id, date) => {
    await updateOrderPickupDate(id, date, "12:00"); // default time
    await fetchData();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(confirmedOrders.map(o => o.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async () => {
    if (selectedOrders.length === 0) return;
    try {
      for (const id of selectedOrders) {
        await updateOrderStatus(id, bulkStatus);
      }
      setSelectedOrders([]);
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ... (JSX rendered below)
  return (
    <div className="page-container max-w-6xl animate-fade-in">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Manage laundry requests and orders</p>
        </div>
      </div>

      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          New Requests 
          {pendingRequests.length > 0 && <span className="badge-count text-white bg-indigo-500">{pendingRequests.length}</span>}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Confirmed Orders
        </button>
      </div>

      {loading ? (
        <div className="flex-center py-12"><div className="loader"></div></div>
      ) : activeTab === 'requests' ? (
        <div className="requests-section">
          {pendingRequests.length === 0 ? (
            <div className="empty-state glass-panel">
              <div className="empty-icon-wrapper">
                <Check size={48} className="text-emerald-400" />
              </div>
              <h3>All caught up!</h3>
              <p>No new laundry requests pending approval.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {pendingRequests.map(req => (
                <div key={req.orderId} className="request-card glass-panel">
                  <div className="req-header">
                    <div>
                      <span className="req-id">{req.orderId}</span>
                      <span className="req-user">User: {req.username} ({req.enrollmentNumber})</span>
                    </div>
                    <span className="req-date">{new Date(req.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="req-body">
                    <p className="req-pickup">
                      Preferred Pickup: <strong>{req.preferredPickupDate} {req.preferredPickupTime}</strong>
                    </p>
                    <div className="req-items">
                      {req.items.map((item, idx) => (
                        <div key={idx} className="item-pill">{item.quantity}x {item.name}</div>
                      ))}
                    </div>
                    {req.specialInstructions && (
                      <div className="req-instructions">
                        <strong>Note:</strong> {req.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div className="req-footer">
                    <button onClick={() => handleConfirm(req.orderId)} className="btn btn-success flex-1">
                      <Check size={18} /> Confirm
                    </button>
                    <button onClick={() => handleReject(req.orderId)} className="btn btn-danger flex-1">
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="orders-section">
          <div className="search-bar glass-panel">
            <div className="search-group">
              <Search size={18} className="text-muted" />
              <input 
                type="text" 
                placeholder="Search by Enrollment Number..." 
                className="search-input"
                value={searchEnrollment}
                onChange={(e) => setSearchEnrollment(e.target.value)}
              />
            </div>
            <div className="search-group date-search">
              <Calendar size={18} className="text-muted" />
              <input 
                type="date" 
                className="search-input"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bulk-actions glass-panel">
            <span className="selection-count">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="bulk-controls">
              <select 
                className="status-select"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                {STATUS_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button 
                className="btn btn-primary" 
                onClick={handleBulkUpdate}
                disabled={selectedOrders.length === 0}
              >
                Apply Bulk Status
              </button>
            </div>
          </div>

          <div className="table-container glass-panel">
            <table className="orders-table">
              <thead>
                <tr>
                  <th width="40">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedOrders.length > 0 && selectedOrders.length === confirmedOrders.length}
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Enrollment No.</th>
                  <th>Order Date</th>
                  <th>Pickup Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-muted">No orders found matching your search.</td>
                  </tr>
                ) : (
                  confirmedOrders.map(order => (
                    <tr key={order.orderId} className={selectedOrders.includes(order.orderId) ? 'selected-row' : ''}>
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => handleSelectOrder(order.orderId)}
                        />
                      </td>
                      <td className="font-mono font-bold text-primary">{order.orderId}</td>
                      <td>{order.username} ({order.enrollmentNumber})</td>
                      <td className="text-muted">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>
                        <input 
                          type="date" 
                          className="table-input"
                          value={order.pickupDate || ''}
                          onChange={(e) => handlePickupDateChange(order.orderId, e.target.value)}
                        />
                      </td>
                      <td>
                        <div className={`status-badge status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </div>
                      </td>
                      <td>
                        <select 
                          className="table-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        >
                          {STATUS_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
