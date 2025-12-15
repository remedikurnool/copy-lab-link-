import React from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Profile: React.FC = () => {
  const { user, darkMode, toggleDarkMode, b2bUser, logoutB2B } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears localStorage
    logoutB2B(); // Clears Zustand
    navigate('/login');
  };

  return (
    <div className="h-full overflow-y-auto pb-24 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark pb-6 pt-safe shadow-sm rounded-b-[2rem] relative z-10">
         <div className="flex items-center justify-between p-4 mb-2">
            <h1 className="text-2xl font-bold text-text-main dark:text-white">My Profile</h1>
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white">
               <span className="material-symbols-outlined filled-icon">{darkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
         </div>
         
         <div className="flex flex-col items-center justify-center">
            {b2bUser ? (
                 <div className="relative mb-3">
                    <div className="size-24 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 shadow-lg shadow-purple-500/30">
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-5xl text-purple-500">business_center</span>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-text-main text-white text-[10px] px-2 py-0.5 rounded-full font-bold border-2 border-white dark:border-surface-dark">PARTNER</div>
                 </div>
            ) : (
                <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-green-300 p-1 mb-3 shadow-lg shadow-primary/30">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                        <span className="material-symbols-outlined text-5xl text-gray-300">person</span>
                    </div>
                </div>
            )}
            
            <h2 className="text-xl font-bold text-text-main dark:text-white">
                {b2bUser ? b2bUser.name : (user.fullName || 'Guest User')}
            </h2>
            <p className="text-text-sub dark:text-gray-400 font-medium">
                {b2bUser ? b2bUser.organization : (user.phone || '+91 XXXXX XXXXX')}
            </p>
            
            {!b2bUser && (!user.fullName || !user.phone) && (
                <Link to="/checkout" className="text-primary text-xs font-bold mt-2 hover:underline">Complete your profile in Checkout</Link>
            )}
         </div>
      </div>

      <div className="px-4 py-6 space-y-6">
         {/* B2B Partner Section (Only visible if logged in) */}
         {b2bUser && (
             <section>
                <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-4 border border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-3 mb-3">
                         <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">verified_user</span>
                         <h3 className="font-bold text-purple-800 dark:text-purple-300">Partner Dashboard</h3>
                    </div>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mb-3">
                        You are logged in as a B2B Partner. You have access to special pricing and bulk booking features.
                    </p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-bold shadow-md shadow-purple-200 dark:shadow-none transition-colors">
                        View Analytics
                    </button>
                </div>
             </section>
         )}

         {/* Health Section */}
         <section>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">My Health</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
               <Link to="/orders" className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <span className="material-symbols-outlined filled-icon">receipt_long</span>
                  </div>
                  <div className="flex-1">
                     <p className="font-bold text-text-main dark:text-white">My Orders</p>
                     <p className="text-xs text-gray-500">View past bookings & status</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
               </Link>
               <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
               <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="size-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                     <span className="material-symbols-outlined filled-icon">lab_profile</span>
                  </div>
                  <div className="flex-1">
                     <p className="font-bold text-text-main dark:text-white">My Reports</p>
                     <p className="text-xs text-gray-500">Access your lab results</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
               </div>
               <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
               <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="size-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                     <span className="material-symbols-outlined filled-icon">favorite</span>
                  </div>
                  <div className="flex-1">
                     <p className="font-bold text-text-main dark:text-white">Family Members</p>
                     <p className="text-xs text-gray-500">Manage family profiles</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
               </div>
            </div>
         </section>

         {/* General Section */}
         <section>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">General</h3>
            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-gray-500 ml-2">notifications</span>
                  <div className="flex-1">
                     <p className="font-medium text-text-main dark:text-white">Notifications</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                      <div className="absolute top-1 left-1 size-4 bg-white rounded-full shadow-sm"></div>
                  </div>
               </div>
               <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
               <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-gray-500 ml-2">help</span>
                  <div className="flex-1">
                     <p className="font-medium text-text-main dark:text-white">Help & Support</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
               </div>
               <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4"></div>
               <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-gray-500 ml-2">description</span>
                  <div className="flex-1">
                     <p className="font-medium text-text-main dark:text-white">Terms & Conditions</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-400">chevron_right</span>
               </div>
            </div>
         </section>
         
         {/* Login / Logout Buttons */}
         <div className="text-center pt-4 pb-8 space-y-4">
            {b2bUser ? (
                <button onClick={handleLogout} className="text-red-500 font-bold text-sm flex items-center justify-center gap-2 w-full p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                    <span className="material-symbols-outlined">logout</span> Log Out
                </button>
            ) : (
                <div className="bg-gray-50 dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-3">Are you a B2B Partner?</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-text-main dark:bg-white text-white dark:text-text-main font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2">
                         <span className="material-symbols-outlined text-[20px]">business_center</span> Partner Login
                    </button>
                </div>
            )}
            
            <p className="text-[10px] text-gray-400 mt-4">Lab Link App v1.1.0</p>
         </div>
      </div>
    </div>
  );
};

export default Profile;