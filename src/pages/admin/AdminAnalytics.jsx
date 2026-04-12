import React, { useState, useEffect, useMemo } from 'react';
import { getAllOrders } from '../../db';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  // Mock Data Generators for Analytics
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const ordersPerDay = React.useMemo(() => days.map(day => ({
    name: day,
    orders: Math.floor(Math.random() * 40) + 10
  })), []);

  const revenueData = React.useMemo(() => days.map(day => ({
    name: day,
    revenue: Math.floor(Math.random() * 1000) + 200
  })), []);

  const PIE_COLORS = ['#2563EB', '#0EA5E9', '#818CF8', '#34D399'];
  const clothesDistribution = [
    { name: 'Shirts', value: 40 },
    { name: 'Pants', value: 25 },
    { name: 'Bedding', value: 20 },
    { name: 'Others', value: 15 },
  ];

  const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-sm font-medium" style={{ color: payload[0].color || payload[0].fill }}>
            {payload[0].name}: {prefix}{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detailed Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Deep dive into your laundry business performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Line Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Orders Per Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersPerDay} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{stroke: '#E2E8F0', strokeWidth: 2}} />
                <Line type="monotone" dataKey="orders" name="Orders" stroke="#2563EB" strokeWidth={3} dot={{r: 4, fill: '#fff', strokeWidth: 2}} activeDot={{r: 6, stroke: '#2563EB', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Analytics ($)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip prefix="$" />} cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="revenue" name="Revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Clothes Type Distribution Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Clothes Distribution</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clothesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {clothesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="w-full mt-4 grid grid-cols-2 gap-3 text-sm px-4">
              {clothesDistribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
