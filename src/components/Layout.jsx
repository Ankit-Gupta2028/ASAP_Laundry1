import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogOut, User, WashingMachine, Bell, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10 shrink-0 sticky top-0 transition-colors duration-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="bg-primary p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <WashingMachine size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ASAP Laundry</span>
          </div>

          {user && (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:block text-sm font-medium text-slate-500 dark:text-slate-400">
                {currentDate}
              </div>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
              
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

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 sm:border-none">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                    {user?.username ? user.username[0].toUpperCase() : <User size={16} />}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">{user?.username}</p>
                    {user?.role === 'user' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID: {user?.enrollmentNumber || user?.id}</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
