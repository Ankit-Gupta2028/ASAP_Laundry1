import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByUser, createOrder, updateOrderStatus, rejectOrder } from '../db';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';
import { Plus, Package, Clock, Calendar, CheckCircle, ChevronRight, Loader2, Info, WashingMachine, CalendarDays, X, Check, XCircle, Shirt } from 'lucide-react';

const STATUS_STAGES = [
  { id: 'Unpack', icon: ShoppingBagIcon, label: 'Requested' },
  { id: 'Washing', icon: WashingMachine, label: 'Washing' },
  { id: 'Drying', icon: Loader2, label: 'Drying' },
  { id: 'Ready for Pickup', icon: Package, label: 'Ready' },
  { id: 'Picked Up', icon: CheckCircle, label: 'Picked Up' }
];

function ShoppingBagIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

// Visual Progress Tracker Component
const ProgressTracker = ({ status, isConfirmed }) => {
  const currentIndex = STATUS_STAGES.findIndex(s => s.id === status);
  // Unpack acts as Requested, but only fully confirmed when isConfirmed is true
  const actualIndex = isConfirmed ? Math.max(0, currentIndex) : -1;

  return (
    <div className="flex items-center w-full justify-between relative pt-4 pb-2">
      <div className="absolute left-0 top-7 w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full -z-10"></div>
      
      {STATUS_STAGES.map((stage, idx) => {
        const Icon = stage.icon;
        const isActive = actualIndex >= idx;
        const isCurrent = actualIndex === idx;
        
        return (
          <div key={stage.id} className="flex flex-col items-center gap-2 z-10 relative">
            {/* The line fill behind the icons */}
            {idx !== 0 && (
              <div 
                className={`absolute right-1/2 top-4 h-1 w-full -translate-y-1/2 -z-10 transition-colors duration-500
                ${isActive ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-700'}`}
              ></div>
            )}
            
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${isActive 
                ? isCurrent ? 'bg-primary text-white ring-4 ring-primary/20 shadow-md scale-110' : 'bg-primary text-white scale-100' 
                : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 scale-90'
              }`}
            >
              {actualIndex > idx ? <Check size={14} strokeWidth={3} /> : <Icon size={14} className={isCurrent && stage.id === 'Washing' ? 'animate-spin' : ''} />}
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider text-center ${isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({ 
    clothes: { shirt: 0, t_shirt: 0, pant: 0, coat: 0, bedding: 0, other: 0 }, 
    pickupDate: '', 
    instructions: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      if (user?.enrollmentNumber) {
        const data = await getOrdersByUser(user.enrollmentNumber);
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      requestNotificationPermission();

      const handleStorageChange = (e) => {
        if (e.key === 'orders') {
          fetchOrders().then(() => {
             sendNotification("Laundry Status Update", { body: "Check your dashboard, an order status was just updated!" });
          });
        }
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const orderItems = Object.entries(newOrderForm.clothes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([id, quantity]) => ({
          id,
          name: id.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
          quantity
        }));

      await createOrder({
        userId: user.id,
        enrollmentNumber: user.enrollmentNumber,
        items: orderItems,
        preferredPickupDate: newOrderForm.pickupDate,
        preferredPickupTime: '12:00',
        specialInstructions: newOrderForm.instructions,
        pickupDate: null,
      });
      setShowModal(false);
      setNewOrderForm({ 
        clothes: { shirt: 0, t_shirt: 0, pant: 0, coat: 0, bedding: 0, other: 0 }, 
        pickupDate: '', 
        instructions: '' 
      });
      fetchOrders();
    } catch(err) {
      alert("Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (orderId) => {
    if(confirm('Are you sure you want to cancel this order?')) {
      await rejectOrder(orderId);
      fetchOrders();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Picked Up').length;
  const activeOrders = orders.filter(o => o.isConfirmed && o.status !== 'Picked Up').length;
  const pendingPickup = orders.filter(o => o.status === 'Ready for Pickup').length;

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-primary/10">
            {user?.username?.[0]?.toUpperCase() || <Shirt size={32} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Welcome back, {user?.username}!</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Student ID: <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md ml-1">{user?.enrollmentNumber}</span></p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Track and manage your laundry orders seamlessly.</p>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Request New Laundry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Orders', value: totalOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', bar: 'bg-blue-600' },
          { label: 'Active Wash', value: activeOrders, icon: WashingMachine, color: 'text-sky-600', bg: 'bg-sky-50', bar: 'bg-sky-500' },
          { label: 'Ready for Pickup', value: pendingPickup, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' },
          { label: 'Completed', value: completedOrders, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-all duration-200">
            <div className={`absolute top-0 left-0 w-full h-1 ${card.bar}`}></div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} dark:bg-opacity-20 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{card.value}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Order Cards List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CalendarDays className="text-primary" size={24} /> Recent Orders
        </h2>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 relative">
              <ShoppingBagIcon size={40} className="text-slate-300 relative z-10" />
              <div className="absolute top-0 left-0 w-full h-full bg-primary/5 rounded-full animate-ping"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No laundry orders yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Your laundry basket is empty. Add your first laundry request to get started.</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={18} /> Add First Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {orders.map((order) => {
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const types = order.items?.map(i => i.name).join(', ') || 'Mixed';
              
              return (
                <div key={order.orderId} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-primary/50 dark:hover:border-primary/50 group">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm">
                          <Shirt size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">{order.orderId}</span>
                            {!order.isConfirmed && (
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Reviewing</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{types}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">{totalItems} Items</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6 transition-colors duration-200">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Requested</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Calendar size={14} className="text-slate-400" /> {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Pickup Date</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Clock size={14} className={order.pickupDate ? "text-primary" : "text-amber-500"} /> 
                          {formatDate(order.pickupDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <ProgressTracker status={order.status} isConfirmed={order.isConfirmed} />
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl border-t border-slate-100 dark:border-slate-700">
                    {!order.isConfirmed && (
                      <button 
                        onClick={() => handleCancel(order.orderId)}
                        className="text-sm font-medium text-slate-500 hover:text-danger flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                       <XCircle size={16} /> Cancel Order
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/order/${order.orderId}`)}
                      className="text-sm font-semibold text-primary hover:text-blue-700 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Info size={16} /> View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Laundry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-fade-in">
            <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary"></div>
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Request Laundry</h2>
                  <p className="text-sm text-slate-500 mt-1">Fill out the details for your new laundry order.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Select Clothes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {Object.entries(newOrderForm.clothes).map(([key, qty]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className="text-sm font-medium text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                          <button 
                            type="button" 
                            onClick={() => setNewOrderForm(prev => ({ ...prev, clothes: { ...prev.clothes, [key]: Math.max(0, qty - 1) } }))}
                            className="text-slate-400 hover:text-primary transition-colors p-1"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold text-slate-900 w-6 text-center">{qty}</span>
                          <button 
                            type="button"
                            onClick={() => setNewOrderForm(prev => ({ ...prev, clothes: { ...prev.clothes, [key]: qty + 1 } }))}
                            className="text-slate-400 hover:text-primary transition-colors p-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-700">Total Items:</span>
                    <span className="text-lg font-bold text-primary">
                      {Object.values(newOrderForm.clothes).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Pickup Date</label>
                  <input 
                    type="date" required min={new Date().toISOString().split('T')[0]}
                    value={newOrderForm.pickupDate}
                    onChange={(e) => setNewOrderForm({...newOrderForm, pickupDate: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Special Instructions (Optional)</label>
                  <textarea 
                    rows="2"
                    value={newOrderForm.instructions}
                    onChange={(e) => setNewOrderForm({...newOrderForm, instructions: e.target.value})}
                    placeholder="E.g. No bleach, fold shirts..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-slate-700 resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting || Object.values(newOrderForm.clothes).reduce((a, b) => a + b, 0) === 0} className="px-5 py-2.5 text-sm font-semibold bg-primary rounded-xl shadow-md min-w-[160px] flex justify-center text-white disabled:opacity-50 transition-all items-center gap-2 hover:bg-blue-700">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
