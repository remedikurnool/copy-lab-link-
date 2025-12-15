import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { UserDetails, Order } from '../types';
import { api } from '../services/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user, updateUser, addOrder } = useStore();
  const { finalTotal } = getCartTotal();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (field: keyof UserDetails, value: any) => {
    updateUser({ [field]: value });
  };

  const handlePlaceOrder = async () => {
    if (!user.fullName || !user.phone) {
        alert("Please enter Name and Phone");
        return;
    }

    if (user.serviceType === 'home' && !user.address) {
        alert("Please enter your full address for Home Collection.");
        return;
    }

    setIsProcessing(true);

    // 1. Prepare WooCommerce Order Payload
    const orderPayload = {
        payment_method: "razorpay", // As per requirement example
        payment_method_title: "Razorpay",
        set_paid: false,
        billing: {
            first_name: user.fullName.split(' ')[0],
            last_name: user.fullName.split(' ').slice(1).join(' ') || '',
            address_1: user.address || 'Lab Visit',
            city: 'Kurnool', 
            state: 'AP',
            postcode: '518001', 
            country: 'IN',
            email: 'guest@lablink.com',
            phone: user.phone
        },
        shipping: {
            first_name: user.fullName.split(' ')[0],
            last_name: user.fullName.split(' ').slice(1).join(' ') || '',
            address_1: user.address || 'Lab Visit',
            city: 'Kurnool',
            state: 'AP',
            postcode: '518001',
            country: 'IN'
        },
        // Mapping cart items as requested: product_id and quantity
        line_items: cart.map(item => ({
            product_id: Number(item.id) || 0, 
            quantity: 1, // Default to 1 as cart doesn't have qty picker yet
            // Optional: keeping metadata if needed by backend, though requirement only showed id/qty
            // meta_data: [{ key: "center", value: item.selectedCenter.centerName }] 
        })),
        meta_data: [
            { key: "service_type", value: user.serviceType },
            { key: "time_slot", value: user.timeSlot },
            { key: "age", value: user.age },
            { key: "gender", value: user.gender }
        ]
    };

    // 2. Submit to WooCommerce
    const response = await api.createOrder(orderPayload);

    if (response.id) {
        // 3. Create Local Order Object for History
        const newOrder: Order = {
            id: response.id.toString(),
            date: new Date().toISOString(),
            items: [...cart],
            totalAmount: finalTotal,
            status: 'Pending',
            userDetails: user
        };
        addOrder(newOrder);
        
        // 4. Clear and Redirect
        clearCart();
        alert(`Order Placed Successfully! Order ID: ${response.id}`);
        navigate('/orders');
    } else {
        alert("Failed to place order: " + (response.message || "Unknown error"));
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="h-full w-full flex flex-col bg-background-light dark:bg-background-dark relative">
       {/* App Bar */}
       <div className="shrink-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Complete Booking</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28">
         <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
           {/* Patient Details */}
           <section>
              <h3 className="text-text-main dark:text-white text-lg font-bold mb-4 px-1">Patient Details</h3>
              <div className="space-y-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Full Name</label>
                    <input type="text" value={user.fullName} onChange={e => handleChange('fullName', e.target.value)} className="w-full rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary h-12 px-4 text-text-main dark:text-white" placeholder="Enter patient name" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Age</label>
                       <input type="number" value={user.age} onChange={e => handleChange('age', e.target.value)} className="w-full rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary h-12 px-4 text-text-main dark:text-white" placeholder="28" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Phone</label>
                       <input type="tel" value={user.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary h-12 px-4 text-text-main dark:text-white" placeholder="Mobile Number" />
                    </div>
                 </div>
                 {/* Gender */}
                 <div className="flex flex-col gap-2">
                   <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Gender</label>
                   <div className="flex bg-gray-100 dark:bg-surface-dark p-1 rounded-xl">
                      {['female', 'male', 'other'].map((g) => (
                         <label key={g} className="flex-1 cursor-pointer">
                            <input type="radio" name="gender" className="peer sr-only" checked={user.gender === g} onChange={() => handleChange('gender', g as any)} />
                            <div className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 capitalize peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-text-main dark:peer-checked:text-white peer-checked:shadow-sm transition-all">
                               {g}
                            </div>
                         </label>
                      ))}
                   </div>
                 </div>
                 {/* Optional Doctor */}
                 <div className="pt-2">
                   <details className="group bg-white dark:bg-surface-dark rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
                      <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-text-main dark:text-white">
                         <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">medical_services</span>
                            Doctor & Prescription <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                         </span>
                         <span className="material-symbols-outlined transition group-open:rotate-180">expand_more</span>
                      </summary>
                      <div className="p-4 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-700">
                         <div className="pt-4">
                            <input type="text" value={user.doctorName || ''} onChange={e => handleChange('doctorName', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 h-10 px-3 text-sm text-text-main dark:text-white" placeholder="Dr. Name" />
                         </div>
                         <div>
                            <label className="flex items-center justify-center w-full h-24 px-4 transition bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-primary">
                               <span className="flex items-center space-x-2">
                                  <span className="material-symbols-outlined text-gray-400">cloud_upload</span>
                                  <span className="font-medium text-gray-600 dark:text-gray-300">Click to upload</span>
                               </span>
                               <input type="file" className="hidden" onChange={() => handleChange('prescriptionAttached', true)} />
                            </label>
                            {user.prescriptionAttached && <p className="text-xs text-green-600 mt-1">File selected</p>}
                         </div>
                      </div>
                   </details>
                 </div>
              </div>
           </section>

           <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>

           {/* Service Type */}
           <section>
              <h3 className="text-text-main dark:text-white text-lg font-bold mb-4 px-1">Service Type</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: 'home', icon: 'home_health', label: 'Home Collection' },
                   { id: 'lab', icon: 'biotech', label: 'Lab Visit' }
                 ].map((type) => (
                    <label key={type.id} className="cursor-pointer relative">
                       <input type="radio" name="service_type" className="peer sr-only" checked={user.serviceType === type.id} onChange={() => handleChange('serviceType', type.id as any)} />
                       <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:shadow-sm group">
                          <div className="flex flex-col items-center gap-2">
                             <span className="material-symbols-outlined text-gray-400 peer-checked:text-primary text-3xl">{type.icon}</span>
                             <span className="font-bold text-sm text-gray-600 dark:text-gray-300 peer-checked:text-text-main dark:peer-checked:text-white">{type.label}</span>
                          </div>
                       </div>
                    </label>
                 ))}
              </div>

              {/* Address Field - Only for Home Collection */}
              {user.serviceType === 'home' && (
                <div className="mt-4 animate-fadeIn">
                    <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Complete Address</label>
                    <textarea
                        value={user.address || ''}
                        onChange={e => handleChange('address', e.target.value)}
                        className="w-full mt-2 rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary p-4 text-text-main dark:text-white h-24 resize-none"
                        placeholder="House No, Street, Landmark, Pincode..."
                    ></textarea>
                </div>
              )}
           </section>
           
           {/* Time Slots */}
           <section>
             <h3 className="text-text-main dark:text-white text-lg font-bold mb-4 px-1">Preferred Time <span className="text-xs text-primary font-normal float-right mt-1">Tomorrow</span></h3>
             <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {[
                  { id: 'morning', label: 'Morning', sub: '08 - 11 AM', icon: 'wb_sunny' },
                  { id: 'afternoon', label: 'Afternoon', sub: '12 - 04 PM', icon: 'wb_twilight' },
                  { id: 'evening', label: 'Evening', sub: '05 - 08 PM', icon: 'dark_mode' }
                ].map((slot) => (
                   <label key={slot.id} className="cursor-pointer shrink-0 min-w-[100px] flex-1">
                      <input type="radio" name="time_slot" className="peer sr-only" checked={user.timeSlot === slot.id} onChange={() => handleChange('timeSlot', slot.id as any)} />
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark peer-checked:bg-primary peer-checked:border-primary transition-all">
                         <span className="material-symbols-outlined mb-1 text-gray-400 peer-checked:text-text-main text-2xl">{slot.icon}</span>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-200 peer-checked:text-text-main">{slot.label}</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 peer-checked:text-text-main">{slot.sub}</span>
                      </div>
                   </label>
                ))}
             </div>
           </section>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 shadow-soft z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total to pay</span>
            <span className="text-2xl font-extrabold text-text-main dark:text-white">₹{finalTotal}</span>
          </div>
          <button 
            onClick={handlePlaceOrder} 
            disabled={isProcessing}
            className={`flex-1 bg-primary hover:bg-green-400 text-text-main font-bold text-base h-12 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
             {isProcessing ? (
               <>
                 <span className="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                 Processing...
               </>
             ) : (
               <>
                 <span className="material-symbols-outlined">shopping_bag</span> Place Order
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;