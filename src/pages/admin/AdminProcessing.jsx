import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../db';
import { MdOutlineLocalLaundryService } from 'react-icons/md';

const STATUS_STAGES = ['Unpack', 'Washing', 'Drying', 'Ironing', 'Ready for Pickup'];

export default function AdminProcessing() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data.filter(o => o.isConfirmed && STATUS_STAGES.includes(o.status)));
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    fetchOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unpack': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Washing': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Drying': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ironing': return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Ready for Pickup': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Processing Orders</h1>
        <p className="text-slate-500 text-sm mt-1">Laundry currently being processed</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer ID</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Pickup Deadline</th>
                <th className="px-6 py-3 font-semibold">Current Phase</th>
                <th className="px-6 py-3 font-semibold text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading processing orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlineLocalLaundryService size={40} className="text-slate-300" />
                      <p className="text-slate-500 font-medium">No orders currently processing</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  const currentIndex = STATUS_STAGES.indexOf(order.status);
                  const nextStage = currentIndex < STATUS_STAGES.length - 1 ? STATUS_STAGES[currentIndex + 1] : 'Picked Up';
                  
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">{order.orderId}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{order.enrollmentNumber}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium text-xs">
                          {totalItems} items
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {order.pickupDate ? `${order.pickupDate} 12:00` : 'Not Set'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleStatusChange(order.orderId, nextStage)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 font-medium text-xs rounded border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        >
                          Mark as {nextStage}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
