import { useState, useEffect } from 'react';
import { getAllOrders, confirmOrder, rejectOrder, updateOrderPickupDate } from '../../db';
import { Check, X, Inbox } from 'lucide-react';

export default function AdminNewOrders() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [pickupDate, setPickupDate] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setRequests(data.filter(o => !o.isConfirmed));
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAcceptClick = (req) => {
    setAcceptingOrder(req);
  };
  
  const handleConfirmAccept = async () => {
    if (!acceptingOrder || !pickupDate) {
      alert("Please select a pickup date.");
      return;
    }
    try {
      await updateOrderPickupDate(acceptingOrder.orderId, pickupDate, "");
      await confirmOrder(acceptingOrder.orderId);
      setSuccessMessage('Order confirmed ✅ Receipt email sent to the user.');
      setAcceptingOrder(null);
      setPickupDate('');
      await fetchRequests();
    } catch (err) {
      setSuccessMessage('');
      console.error(err);
      alert('Failed to confirm order.');
    }
  };

  const handleReject = async (id) => {
    if (confirm('Are you sure you want to reject this request?')) {
      await rejectOrder(id);
      await fetchRequests();
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-medium">Loading incoming requests...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incoming Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Review and approve new laundry orders.</p>
          {successMessage && (
            <div className="mt-2 inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {successMessage}
            </div>
          )}
        </div>
        <span className="bg-warning/10 text-warning text-xs font-bold px-3 py-1 rounded-full border border-warning/20">
          {requests.length} Pending
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {requests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
               <Inbox size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Inbox Zero</h3>
            <p className="text-slate-500 mt-2 max-w-sm">You've caught up on all customer requests. New orders will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Items</th>
                  <th className="px-6 py-4 font-semibold">Pref. Pickup</th>
                  <th className="px-6 py-4 font-semibold">Special Notes</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {requests.map((req) => (
                  <tr key={req.orderId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono font-medium text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                        {req.orderId}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{new Date(req.orderDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{req.enrollmentNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {req.items.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                        {req.items.length > 3 && (
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            +{req.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">{req.preferredPickupDate}</span>
                      <span className="text-slate-400 ml-1">{req.preferredPickupTime}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                      {req.specialInstructions || <span className="text-slate-300 italic">None</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleReject(req.orderId)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject Order"
                        >
                          <X size={18} />
                        </button>
                        <button 
                          onClick={() => handleAcceptClick(req)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all shadow-sm active:scale-95"
                        >
                          <Check size={16} /> Accept
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {acceptingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
