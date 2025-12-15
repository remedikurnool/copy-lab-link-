import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../store';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { cart } = useStore();
  
  // Hide bottom nav on details, checkout, cart, orders, doctor, and login pages
  const hideBottomNav = ['/checkout', '/cart', '/details', '/doctor', '/orders', '/login'].some(path => pathname.includes(path));

  return (
    <div className="h-[100dvh] w-full bg-background-light dark:bg-background-dark md:max-w-md md:mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Main Content Area - Children are responsible for scrolling */}
      <div className="flex-1 w-full overflow-hidden relative">
        {children}
      </div>

      {!hideBottomNav && (
        <nav className="shrink-0 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 py-2 px-6 flex justify-between items-center z-40 w-full pb-safe">
          <Link to="/" className={`flex flex-col items-center gap-1 group ${pathname === '/' ? 'text-primary' : 'text-gray-400 hover:text-text-main dark:hover:text-gray-200'}`}>
            <span className={`material-symbols-outlined text-[26px] ${pathname === '/' ? 'filled-icon' : ''}`}>home</span>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <Link to="/explore" className={`flex flex-col items-center gap-1 group ${pathname === '/explore' ? 'text-primary' : 'text-gray-400 hover:text-text-main dark:hover:text-gray-200'}`}>
            <span className={`material-symbols-outlined text-[26px] ${pathname === '/explore' ? 'filled-icon' : ''}`}>search</span>
            <span className="text-[10px] font-medium">Explore</span>
          </Link>
          <Link to="/cart" className={`flex flex-col items-center gap-1 group ${pathname === '/cart' ? 'text-primary' : 'text-gray-400 hover:text-text-main dark:hover:text-gray-200'} relative`}>
            <span className={`material-symbols-outlined text-[26px] ${pathname === '/cart' ? 'filled-icon' : ''}`}>shopping_cart</span>
            <span className="text-[10px] font-medium">Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-1 right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cart.length}</span>
            )}
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 group ${pathname === '/profile' ? 'text-primary' : 'text-gray-400 hover:text-text-main dark:hover:text-gray-200'}`}>
            <span className={`material-symbols-outlined text-[26px] ${pathname === '/profile' ? 'filled-icon' : ''}`}>person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </nav>
      )}
    </div>
  );
};