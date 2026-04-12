import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, confirmUserPickup } from '../db';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Loader2, Package, CheckCircle2, Circle, Printer, Receipt } from 'lucide-react';
import { calculateOrderTotal, formatCurrency, ITEM_PRICES } from '../utils/pricing';
import './OrderTracker.css';

const STATUS_STAGES = [
  'Unpack',
  'Washing',
  'Drying',
  'Ironing',
  'Ready for Pickup',
  'Picked Up'
];

export default function OrderTracker() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        if (data.enrollmentNumber !== user.enrollmentNumber && user.role !== 'admin') {
          setError('Unauthorized to view this order.');
        } else {
          setOrder(data);
        }
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user]);

  const formatDate = (dateString, timeString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return timeString ? `${dateFormatted} at ${timeString}` : dateFormatted;
  };

  if (loading) return <div className="page-container flex-center min-h-[50vh]"><Loader2 className="animate-spin text-indigo-400" size={40} /></div>;
  if (error) return <div className="page-container"><div className="error-banner">{error}</div></div>;
  if (!order) return null;

  const currentStageIndex = STATUS_STAGES.indexOf(order.status);
  const totalItemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="btn-back btn btn-secondary"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="tracker-header">
        <div>
          <h1 className="page-title">Order {order.orderId}</h1>
          <p className="page-subtitle">Placed on {formatDate(order.orderDate)}</p>
        </div>
        <div className={`status-badge status-${order.status.toLowerCase()}`}>
          {order.status}
        </div>
      </div>

      <div className="tracking-timeline glass-panel">
        <h3 className="section-title">Tracking Progress</h3>
        
        <div className="timeline-container">
          <div className="timeline-line">
            <div 
              className="timeline-progress" 
              style={{ width: `${(currentStageIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
            ></div>
          </div>
          
          <div className="timeline-steps">
            {STATUS_STAGES.map((stage, index) => {
              const isLastStage = index === STATUS_STAGES.length - 1;
              const isCompleted = index < currentStageIndex || (isLastStage && currentStageIndex === index);
              const isCurrent = index === currentStageIndex && !isLastStage;
              
              return (
                <div key={stage} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-icon-wrapper">
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="step-icon" />
                    ) : (
                      <Circle size={24} className={`step-icon ${isCurrent ? 'animate-pulse' : ''}`} />
                    )}
                  </div>
                  <span className="step-label">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {order.status === 'Ready for Pickup' && !order.userPickupConfirmed && user.role === 'user' && (
          <div className="pickup-alert">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
            <div className="flex-1">
              <span className="block mb-2">Your laundry is ready! Please collect it by <strong>{formatDate(order.pickupDate, order.pickupTime)}</strong>.</span>
              <button 
                className="btn btn-success btn-sm w-full mt-2"
                onClick={async () => {
                  try {
                    await confirmUserPickup(order.orderId);
                    const updated = await getOrderById(order.orderId);
                    setOrder(updated);
                  } catch (e) {
                    setError('Failed to confirm pickup.');
                  }
                }}
              >
                Yes, I have picked it up
              </button>
            </div>
          </div>
        )}

        {(order.status === 'Picked Up' || order.userPickupConfirmed) && (
           <div className="pickup-alert" style={{ background: 'rgba(2, 132, 199, 0.1)', borderColor: 'rgba(2, 132, 199, 0.2)', color: '#0369a1' }}>
             <CheckCircle2 size={24} className="text-indigo-400 shrink-0" />
             <span>This order has been successfully picked up and is complete!</span>
           </div>
        )}
      </div>

      <div className="order-details-card glass-panel">
        <h3 className="section-title">Order Details</h3>
        
        <div className="items-list">
          {order.items.map((item, idx) => {
            const price = ITEM_PRICES[item.id] || ITEM_PRICES['others'];
            const lineTotal = price * item.quantity;
            return (
              <div key={idx} className="order-item-row">
                <div className="item-name-col">
                  <Package size={18} className="text-muted" />
                  <span>{item.name}</span>
                </div>
                <div className="item-qty-col flex items-center gap-4">
                  <span>Qty: <strong>{item.quantity}</strong></span>
                  <span className="text-indigo-300 w-16 text-right">{formatCurrency(lineTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="order-summary">
          <div className="summary-row">
            <span>Total Items:</span>
            <strong>{totalItemsCount}</strong>
          </div>
          <div className="summary-row text-indigo-100" style={{ color: '#0f172a' }}>
            <span>Preferred Pickup:</span>
            <strong>{formatDate(order.preferredPickupDate, order.preferredPickupTime)}</strong>
          </div>
          {order.pickupDate && (
            <div className="summary-row text-emerald-300">
              <span>Confirmed Pickup:</span>
              <strong>{formatDate(order.pickupDate, order.pickupTime)}</strong>
            </div>
          )}
          
          <div className="summary-row order-total mt-2 pt-2 text-lg font-bold" style={{ borderTop: '1px solid rgba(2, 132, 199, 0.1)' }}>
            <span>Grand Total:</span>
            <span className="text-emerald-400" style={{ color: '#059669' }}>{formatCurrency(calculateOrderTotal(order.items))}</span>
          </div>
          
          {order.specialInstructions && (
            <div className="mt-4 pt-4 hide-on-print" style={{ borderTop: '1px solid rgba(2, 132, 199, 0.1)' }}>
              <span className="text-muted block mb-2" style={{ fontSize: '0.85rem' }}>Special Instructions:</span>
              <p className="text-sm italic" style={{ color: '#475569' }}>"{order.specialInstructions}"</p>
            </div>
          )}
        </div>

        {(order.status === 'Picked Up' || order.userPickupConfirmed) && (
           <div className="mt-6 pt-6 flex justify-center hide-on-print" style={{ borderTop: '1px solid rgba(2, 132, 199, 0.1)' }}>
             <button 
               className="btn btn-primary"
               onClick={() => window.print()}
             >
               <Printer size={18} /> Print Invoice
             </button>
           </div>
        )}
      </div>
    </div>
  );
}
