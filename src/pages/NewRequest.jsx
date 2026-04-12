import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../db';
import { Loader2, Plus, Minus, ArrowLeft, Shirt, ShoppingBag } from 'lucide-react';
import './NewRequest.css';

const CLOTHING_ITEMS = [
  { id: 'shirt', name: 'Shirt', icon: '👔' },
  { id: 'pants', name: 'Pants', icon: '👖' },
  { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
  { id: 'jeans', name: 'Jeans', icon: '👖' },
  { id: 'jacket', name: 'Jacket', icon: '🧥' },
  { id: 'others', name: 'Others', icon: '🧺' },
];

const MAX_ITEMS = 15;

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState(
    CLOTHING_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
  );
  
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalItems = Object.values(items).reduce((sum, count) => sum + count, 0);

  const handleIncrement = (id) => {
    if (totalItems >= MAX_ITEMS) {
      setError(`Maximum ${MAX_ITEMS} items allowed per request.`);
      return;
    }
    setError('');
    setItems(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id) => {
    if (items[id] > 0) {
      setError('');
      setItems(prev => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalItems === 0) {
      setError('Please add at least one item to your laundry request.');
      return;
    }
    if (!pickupDate || !pickupTime) {
      setError('Please select a preferred pickup date and time.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // transform items object to an array of selected items
      const selectedItems = CLOTHING_ITEMS
        .filter(target => items[target.id] > 0)
        .map(target => ({
          id: target.id,
          name: target.name,
          quantity: items[target.id]
        }));

      await createOrder({
        userId: user.id,
        enrollmentNumber: user.enrollmentNumber,
        items: selectedItems,
        preferredPickupDate: pickupDate,
        preferredPickupTime: pickupTime,
        specialInstructions: specialInstructions.trim(),
        pickupDate: null, // to be set by admin later
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-3xl animate-fade-in">
      <button 
        onClick={() => navigate('/dashboard')}
        className="btn-back btn btn-secondary"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="request-header">
        <h1 className="page-title">New Laundry Request</h1>
        <p className="page-subtitle">Select your apparel and schedule a pickup</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <section className="form-section glass-panel">
          <div className="section-header">
            <h3><Shirt size={20} className="text-indigo-400" /> Clothing Items</h3>
            <span className={`item-counter ${totalItems === MAX_ITEMS ? 'text-danger' : ''}`}>
              {totalItems} / {MAX_ITEMS} selected
            </span>
          </div>

          <div className="items-grid">
            {CLOTHING_ITEMS.map((item) => (
              <div key={item.id} className={`item-card ${items[item.id] > 0 ? 'active' : ''}`}>
                <div className="item-info">
                  <span className="item-emoji">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    type="button" 
                    className="qty-btn"
                    onClick={() => handleDecrement(item.id)}
                    disabled={items[item.id] === 0}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{items[item.id]}</span>
                  <button 
                    type="button" 
                    className="qty-btn"
                    onClick={() => handleIncrement(item.id)}
                    disabled={totalItems >= MAX_ITEMS}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="form-section glass-panel">
          <div className="section-header">
            <h3><ShoppingBag size={20} className="text-emerald-400" /> Pickup Schedule</h3>
          </div>
          
          <div className="schedule-grid">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="pickupDate">Preferred Date</label>
              <input 
                id="pickupDate"
                type="date"
                className="form-input"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="pickupTime">Preferred Time</label>
              <input 
                id="pickupTime"
                type="time"
                className="form-input"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label" htmlFor="specialInstructions">Special Instructions (Optional)</label>
            <textarea
              id="specialInstructions"
              className="form-input"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Please use fabric softener, careful with the silk shirt..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </section>

        <div className="submit-section">
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isSubmitting || totalItems === 0}
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Processing...</>
            ) : (
              <><Plus size={20} /> Request Laundry</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
