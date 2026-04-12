import { useState, useEffect } from 'react';
import { getAllOrders } from '../../db';
import { ShoppingBag, Loader2, PlayCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mini Chart Component for Cards
const MiniTrendChart = ({ data, color }) => (
  <div className="h-12 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`color-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${color})`} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default function AdminDashboardHome() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  const total = orders.length;
  const pending = orders.filter(o => !o.isConfirmed).length;
  const processing = orders.filter(o => o.isConfirmed && o.status !== 'Picked Up').length;
  const completed = orders.filter(o => o.status === 'Picked Up').length;
  
  // Calculate mock revenue
  const revenueToday = total * 12.50; // Mock calculation

  // Mock Trend Data for Mini Charts
  const generateTrend = () => Array.from({length: 7}, () => ({ value: Math.floor(Math.random() * 50) + 10 }));

  const cards = [
    {
      title: 'Total Orders',
      value: total,
      icon: ShoppingBag,
      color: '#2563EB',
      bgClass: 'bg-primary/10',
      textClass: 'text-primary',
      barClass: 'bg-primary',
      trend: '+12.5%',
      trendUp: true,
      trendData: generateTrend(),
    },
    {
      title: 'Pending Orders',
      value: pending,
      icon: Loader2,
      color: '#F59E0B',
      bgClass: 'bg-warning/10',
      textClass: 'text-warning',
      barClass: 'bg-warning',
      trend: '+4.2%',
      trendUp: true,
      trendData: generateTrend(),
    },
    {
      title: 'Processing Orders',
      value: processing,
      icon: PlayCircle,
      color: '#0EA5E9',
      bgClass: 'bg-secondary/10',
      textClass: 'text-secondary',
      barClass: 'bg-secondary',
      trend: '-2.1%',
      trendUp: false,
      trendData: generateTrend(),
    },
    {
      title: 'Completed Orders',
      value: completed,
      icon: CheckCircle2,
      color: '#22C55E',
      bgClass: 'bg-success/10',
      textClass: 'text-success',
      barClass: 'bg-success',
      trend: '+18.4%',
      trendUp: true,
      trendData: generateTrend(),
    },
    {
      title: 'Revenue Today',
      value: `$${revenueToday.toFixed(2)}`,
      icon: DollarSign,
      color: '#8B5CF6',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600',
      barClass: 'bg-purple-600',
      trend: '+8.1%',
      trendUp: true,
      trendData: generateTrend(),
    }
  ];

  // Mock Chart Data for Volume
  const volumeData = [
    { name: 'Mon', orders: 12 },
    { name: 'Tue', orders: 19 },
    { name: 'Wed', orders: 15 },
    { name: 'Thu', orders: 22 },
    { name: 'Fri', orders: 28 },
    { name: 'Sat', orders: 35 },
    { name: 'Sun', orders: Math.max(10, total) },
  ];

  // Mock Chart Data for Services Distribution
  const PIE_COLORS = ['#2563EB', '#0EA5E9', '#818CF8', '#34D399'];
  const servicesData = [
    { name: 'Wash & Fold', value: 45 },
    { name: 'Dry Cleaning', value: 25 },
    { name: 'Ironing Only', value: 15 },
    { name: 'Bulk Bedding', value: 15 },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Analytics, performance, and revenue tracking.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all duration-300 relative flex flex-col">
              {/* Colored Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${card.barClass}`}></div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${card.bgClass} ${card.textClass}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${card.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {card.trend}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
                <p className="text-xs font-medium text-slate-500 mt-1 mb-4">{card.title}</p>
                
                <div className="mt-auto flex justify-end">
                  <MiniTrendChart data={card.trendData} color={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Order Volume (Past 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 13}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{stroke: '#E2E8F0', strokeWidth: 2}}
                />
                <Line type="monotone" dataKey="orders" stroke="#2563EB" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6, stroke: '#2563EB', strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Services Breakdown</h3>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="w-full mt-2 grid grid-cols-2 gap-3 text-xs">
              {servicesData.map((entry, index) => (
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
