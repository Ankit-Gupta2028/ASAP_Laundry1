import { useState, useEffect } from 'react';
import { getAllOrders } from '../../db';
import { MdOutlineLocalLaundryService, MdCheckCircleOutline } from 'react-icons/md';

export default function AdminCompleted() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data.filter(o => o.status === 'Picked Up'));
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Completed Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Laundry that has been picked up by the customer</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-emerald-200">
          <MdCheckCircleOutline size={18} />
          {orders.length} Completed
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold">Order ID</th>
                <th className="px-6 py-3 font-semibold">Customer ID</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Order Date</th>
                <th className="px-6 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading history...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MdOutlineLocalLaundryService size={40} className="text-slate-300" />
                      <p className="text-slate-500 font-medium">No completed orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">{order.orderId}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{order.enrollmentNumber}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium text-xs">
                          {totalItems} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                          Picked Up
                        </span>
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
