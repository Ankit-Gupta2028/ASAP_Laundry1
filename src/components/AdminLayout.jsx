import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Inbox, 
  ListOrdered, 
  WashingMachine, 
  CheckCircle, 
  LogOut, 
  Bell, 
  Search,
  Settings,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'New Orders', path: '/admin/requests', icon: Inbox },
    { name: 'Order List', path: '/admin/orders', icon: ListOrdered },
    { name: 'Processing Orders', path: '/admin/processing', icon: WashingMachine },
    { name: 'Completed Orders', path: '/admin/completed', icon: CheckCircle },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex h-screen bg-background dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Dark Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 text-white border-b border-slate-800">
          <div className="bg-primary p-2 rounded-lg">
            <WashingMachine size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ASAP Laundry</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Management</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-white shadow-md shadow-primary/20' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm transition-colors duration-200">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, customers, or settings..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-900 dark:text-gray-100 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-sm font-medium text-slate-500 dark:text-slate-400">
              {currentDate}
            </div>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="relative text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">{user?.username}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shadow-md">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background dark:bg-slate-900 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
