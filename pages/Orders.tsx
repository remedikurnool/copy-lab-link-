import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Completed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background-light dark:bg-background-dark">
      {/* App Bar */}
      <div className="shrink-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between h-16">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-main dark:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">My Orders</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-outlined text-6xl text-gray-300">receipt_long</span>
            <p className="text-gray-500">No orders yet</p>
            <button onClick={() => navigate('/explore')} className="bg-primary px-6 py-2 rounded-full font-bold text-text-main">Book a Test</button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs text-gray-400 font-medium">#{order.id}</span>
                    <p className="text-sm font-bold text-text-main dark:text-white">{new Date(order.date).toLocaleDateString()} <span className="font-normal text-gray-400">at</span> {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                             <div className="flex flex-col">
                                <span className="text-text-main dark:text-gray-200 font-medium">{item.name}</span>
                                <span className="text-[10px] text-gray-500">{item.selectedCenter.centerName}</span>
                             </div>
                             <span className="text-gray-600 dark:text-gray-400">₹{item.selectedCenter.price}</span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-700 my-3"></div>
                
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-wide">Total Paid</span>
                         <span className="text-lg font-bold text-text-main dark:text-white">₹{order.totalAmount}</span>
                    </div>
                    <button className="text-primary text-sm font-bold flex items-center gap-1">
                        View Details <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;