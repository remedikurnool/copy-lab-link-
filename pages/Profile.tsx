import React from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Profile: React.FC = () => {
  const { user, darkMode, toggleDarkMode, b2bUser, logoutB2B, patients } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutB2B();
    navigate('/login');
  };

  return (
    <div className="h-full overflow-y-auto pb-32 pt-safe px-6">
       <div className="flex items-center justify-between mb-8 mt-6">
          <h1 className="text-3xl font-display font-bold text-text-main dark:text-white">Profile</h1>
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden">
             <span className="material-symbols-rounded text-3xl text-gray-400">person</span>
          </div>
       </div>

       <div className="w-full h-48 rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white/10 dark:to-white/5 relative overflow-hidden shadow-2xl mb-8 p-6 flex flex-col justify-between group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-light/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
           <div className="flex justify-between items-start z-10">
               <div>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Membership ID</p>
                   <p className="text-white font-mono opacity-80">8823 1102 9934</p>
               </div>
               <span className="material-symbols-rounded text-white/50 text-3xl">verified</span>
           </div>
           <div className="z-10">
               <h2 className="text-white text-2xl font-bold mb-1">{b2bUser ? b2bUser.name : (user.fullName || 'Guest User')}</h2>
               <p className="text-primary-light text-sm font-medium">{b2bUser ? 'Partner Account' : 'Standard Member'}</p>
           </div>
       </div>

       <div className="grid grid-cols-2 gap-4 mb-6">
           <Link to="/orders" className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/10 shadow-card flex flex-col gap-3 active:scale-95 transition-transform">
               <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                   <span className="material-symbols-rounded">receipt_long</span>
               </div>
               <div>
                   <p className="font-bold text-text-main dark:text-white">My Bookings</p>
                   <p className="text-xs text-text-sub dark:text-gray-400">Past & active</p>
               </div>
           </Link>
           <Link to="/patients" className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/10 shadow-card flex flex-col gap-3 active:scale-95 transition-transform">
               <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                   <span className="material-symbols-rounded">group</span>
               </div>
               <div>
                   <p className="font-bold text-text-main dark:text-white">My Patients</p>
                   <p className="text-xs text-text-sub dark:text-gray-400">{patients.length} Saved</p>
               </div>
           </Link>
       </div>

       <div className="bg-white dark:bg-white/5 rounded-3xl p-2 shadow-card border border-gray-100 dark:border-white/10 mb-8">
           <button onClick={toggleDarkMode} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                       <span className="material-symbols-rounded text-lg">dark_mode</span>
                   </div>
                   <span className="font-medium text-text-main dark:text-white">Dark Mode</span>
               </div>
               <div className={`w-10 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-primary-light' : 'bg-gray-200 dark:bg-white/20'}`}>
                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? 'left-5' : 'left-1'}`}></div>
               </div>
           </button>
           <div className="h-px bg-gray-100 dark:bg-white/5 mx-4"></div>
           <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
               <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                       <span className="material-symbols-rounded text-lg">settings</span>
                   </div>
                   <span className="font-medium text-text-main dark:text-white">Settings</span>
               </div>
               <span className="material-symbols-rounded text-gray-400">chevron_right</span>
           </button>
       </div>

       {b2bUser ? (
            <button onClick={handleLogout} className="w-full py-4 rounded-3xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors">
                Log Out
            </button>
       ) : (
            <button onClick={() => navigate('/login')} className="w-full py-4 rounded-3xl bg-text-main dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg active:scale-95 transition-transform">
                Partner Login
            </button>
       )}
       <p className="text-center text-xs text-gray-400 mt-6">App Version 2.0.0</p>
    </div>
  );
};

export default Profile;