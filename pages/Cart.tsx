import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Cart: React.FC = () => {
  const { cart, removeFromCart, getCartTotal, applyCoupon, removeCoupon, appliedCoupon } = useStore();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const { subtotal, discount, homeCollectionCharges, finalTotal } = getCartTotal();

  const handleApplyCoupon = () => {
    const error = applyCoupon(couponInput);
    setCouponError(error);
    if (!error) setCouponInput('');
  };

  const navigateToItemDetails = (item: any) => {
    if (item.type === 'doctor') {
      navigate(`/doctor/${item.id}`);
    } else {
      navigate(`/details/${item.id}`);
    }
  };

  return (
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark relative">
      {/* App Bar */}
      <div className="shrink-0 z-20 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between h-16">
          <button onClick={() => navigate(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-text-main dark:text-white">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">My Cart ({cart.length})</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 hide-scrollbar">
        {/* Safety Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 flex items-center justify-center gap-2">
          <span className="material-symbols-rounded text-blue-600 dark:text-blue-400 text-[18px]">verified_user</span>
          <p className="text-blue-800 dark:text-blue-300 text-xs font-semibold uppercase tracking-wide">Safe & Hygienic Collection</p>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="material-symbols-rounded text-6xl text-gray-300">shopping_cart_off</span>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <button onClick={() => navigate('/explore')} className="bg-primary px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20">Browse Tests</button>
          </div>
        ) : (
          <>
            {/* List Items */}
            {cart.map((item) => (
              <div key={item.cartId} className="flex flex-col gap-4 p-4 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      onClick={() => navigateToItemDetails(item)}
                      className="bg-gray-100 rounded-2xl size-[72px] shrink-0 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    >
                       <img src={item.imageUrl || "https://picsum.photos/100"} alt="test" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1">
                      <div className="flex justify-between items-start">
                        <h3 
                          onClick={() => navigateToItemDetails(item)}
                          className="text-text-main dark:text-white text-base font-bold leading-tight cursor-pointer hover:text-primary transition-colors"
                        >
                          {item.name}
                        </h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <span className="material-symbols-rounded text-[20px]">delete</span>
                        </button>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{item.selectedCenter.centerName}</p>
                      
                      {/* Show Slot info if available (for doctors) */}
                      {item.appointmentDate && (
                         <div className="flex items-center gap-1 mt-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 w-fit px-2 py-0.5 rounded-md">
                            <span className="material-symbols-rounded text-[14px]">event</span>
                            <span>{item.appointmentDate} • {item.appointmentSlot}</span>
                         </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-text-main dark:text-white text-base font-bold">₹{item.selectedCenter.price}</span>
                        {item.selectedCenter.mrp > item.selectedCenter.price && (
                           <span className="text-gray-400 text-sm line-through">₹{item.selectedCenter.mrp}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon Section */}
            <div className="p-4">
              <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-dashed border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-rounded text-primary text-[20px]">local_offer</span>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Apply Coupon</h3>
                </div>
                {appliedCoupon ? (
                   <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800">
                      <div>
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">'{appliedCoupon.code}' Applied</p>
                        <p className="text-xs text-green-600">You saved ₹{discount}</p>
                      </div>
                      <button onClick={removeCoupon} className="text-red-500 text-xs font-bold px-2">REMOVE</button>
                   </div>
                ) : (
                  <>
                    <label className="flex w-full items-stretch rounded-xl h-12 shadow-sm">
                      <input 
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(null); }}
                        className="flex w-full min-w-0 flex-1 rounded-l-xl text-text-main dark:text-white bg-gray-50 dark:bg-gray-700 border-none h-full placeholder:text-gray-400 px-4 text-sm font-normal" 
                        placeholder="Try 'FIRST50'" 
                      />
                      <button onClick={handleApplyCoupon} className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-r-xl h-full px-4 bg-text-main dark:bg-primary text-white dark:text-text-main text-sm font-bold tracking-wide">
                        APPLY
                      </button>
                    </label>
                    {couponError && <p className="text-red-500 text-xs mt-2 ml-1">{couponError}</p>}
                  </>
                )}
              </div>
            </div>

            {/* Bill Details */}
            <div className="px-4 pb-4">
              <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
                <h3 className="text-base font-bold mb-4 text-text-main dark:text-white">Payment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Item Total (MRP)</span>
                    <span className="text-text-main dark:text-gray-200 font-medium">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Discount</span>
                      <span className="text-primary font-medium">-₹{discount}</span>
                    </div>
                  )}
                  {homeCollectionCharges > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Home Collection</span>
                      <span className="text-text-main dark:text-gray-200 font-medium">₹{homeCollectionCharges}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                  <div className="flex justify-between items-center text-base font-bold">
                    <span className="text-text-main dark:text-white">To Pay</span>
                    <span className="text-text-main dark:text-white text-lg">₹{finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Absolute Footer Bar */}
      {cart.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 shadow-soft z-30">
          <div className="flex items-center gap-4 max-w-lg mx-auto">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total to Pay</span>
              <span className="text-xl font-extrabold text-text-main dark:text-white leading-none">₹{finalTotal}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="flex-1 bg-primary hover:bg-primary-dark text-text-main h-14 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-transform active:scale-95">
               Select Address & Pay <span className="material-symbols-rounded text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;