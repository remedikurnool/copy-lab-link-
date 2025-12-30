import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { cart, toasts, removeToast } = useStore();
  
  // Whitelist approach: Only show bottom nav on these main tabs
  const mainTabs = ['/', '/explore', '/cart', '/profile'];
  const showBottomNav = mainTabs.includes(pathname);

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/explore', icon: 'grid_view', label: 'Explore' },
    { path: '/cart', icon: 'shopping_bag', label: 'Cart', badge: cart.length },
    { path: '/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <div className="h-[100dvh] w-full md:max-w-md md:mx-auto relative flex flex-col md:shadow-2xl md:my-4 md:h-[95vh] md:rounded-[3rem] overflow-hidden bg-transparent">
      {/* Toast Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[350px] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-float flex items-center gap-3 animate-slide-up border backdrop-blur-md ${
              toast.type === 'error' 
                ? 'bg-red-500/90 text-white border-red-400' 
                : toast.type === 'success' 
                ? 'bg-green-500/90 text-white border-green-400'
                : 'bg-white/90 dark:bg-surface-dark/90 text-text-main dark:text-white border-gray-100 dark:border-white/10'
            }`}
          >
            <span className="material-symbols-rounded text-xl">
              {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
            </span>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100">
              <span className="material-symbols-rounded text-sm">close</span>
            </button>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-hidden relative">
        {children}
      </div>

      {showBottomNav && (
        <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-slide-up">
          <nav className="pointer-events-auto bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-float rounded-full px-2 py-2 flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-text-main dark:bg-white text-white dark:text-black scale-100 shadow-glow' 
                      : 'text-text-sub dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-rounded text-[24px] ${isActive ? 'filled-icon' : ''}`}>
                    {item.icon}
                  </span>
                  
                  {item.badge ? (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white dark:border-surface-dark transform translate-x-1 -translate-y-1">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};