import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { UserDetails, Order, Patient } from '../types';
import { api } from '../services/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user, updateUser, addOrder, patients, addToast } = useStore();
  const { subtotal, discount, homeCollectionCharges, finalTotal } = getCartTotal();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart, navigate]);

  const handleChange = (field: keyof UserDetails, value: any) => {
    updateUser({ [field]: value });
  };

  const selectPatient = (p: Patient) => {
    updateUser({
      fullName: p.fullName,
      age: p.age,
      phone: p.phone,
      gender: p.gender,
      address: p.address || user.address
    });
    addToast(`Patient ${p.fullName.split(' ')[0]} selected`, 'info');
  };

  const handlePlaceOrder = async () => {
    if (!user.fullName || !user.phone) {
        addToast("Please enter Name and Phone", "error");
        return;
    }
    if (user.serviceType === 'home' && !user.address) {
        addToast("Please enter your full address for Home Collection.", "error");
        return;
    }

    setIsProcessing(true);
    const orderPayload = {
        payment_method: "razorpay",
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
        line_items: cart.map(item => ({
            product_id: Number(item.id) || 0, 
            quantity: 1,
        })),
        meta_data: [
            { key: "service_type", value: user.serviceType },
            { key: "time_slot", value: user.timeSlot },
            { key: "age", value: user.age },
            { key: "gender", value: user.gender }
        ]
    };

    try {
        const response = await api.createOrder(orderPayload);
        if (response.id) {
            const newOrder: Order = {
                id: response.id.toString(),
                date: new Date().toISOString(),
                items: [...cart],
                totalAmount: finalTotal,
                status: 'Pending',
                userDetails: { ...user }
            };
            addOrder(newOrder);
            clearCart();
            addToast(`Order Placed Successfully!`, "success");
            // Use replace: true so going back from orders doesn't go to checkout
            navigate('/orders', { replace: true });
        } else {
            addToast("Failed to place order: " + (response.message || "Unknown error"), "error");
        }
    } catch (e) {
        addToast("Connection error. Please try again.", "error");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-background-light dark:bg-background-dark relative animate-slide-in-right">
       <div className="shrink-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 justify-between max-w-lg mx-auto h-16">
          <button onClick={() => navigate(-1)} className="text-text-main dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Complete Booking</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-40 hide-scrollbar">
         <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
           {/* Quick Select Patient */}
           {patients.length > 0 && (
             <section className="animate-fade-in">
                <div className="flex items-center justify-between mb-3 px-1">
                   <h3 className="text-text-main dark:text-white text-sm font-bold uppercase tracking-wider">Select Saved Patient</h3>
                   <button onClick={() => navigate('/patients')} className="text-primary text-xs font-bold px-2 py-1 rounded-md hover:bg-primary/10 transition-colors">Manage</button>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                   {patients.map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => selectPatient(p)}
                        className={`shrink-0 px-5 py-3 rounded-2xl border transition-all flex items-center gap-3 ${
                           user.fullName === p.fullName ? 'bg-primary border-transparent shadow-glow text-white' : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-800 text-text-main dark:text-gray-300'
                        }`}
                      >
                         <span className="material-symbols-rounded text-lg">{p.gender === 'female' ? 'female' : 'male'}</span>
                         <div className="text-left">
                            <p className="text-sm font-bold leading-none">{p.fullName.split(' ')[0]}</p>
                            <p className={`text-[10px] opacity-60 ${user.fullName === p.fullName ? 'text-white' : 'text-gray-400'}`}>{p.age} Yrs</p>
                         </div>
                      </button>
                   ))}
                </div>
             </section>
           )}

           <section>
              <h3 className="text-text-main dark:text-white text-lg font-bold mb-4 px-1">Patient Details</h3>
              <div className="space-y-4">
                 <div className="flex flex-col gap-2">
                    <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Full Name</label>
                    <input type="text" value={user.fullName} onChange={e => handleChange('fullName', e.target.value)} className="w-full rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary h-12 px-4 text-text-main dark:text-white transition-shadow" placeholder="Enter patient name" />
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
                 <div className="pt-2">
                   <details className="group bg-white dark:bg-surface-dark rounded-xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
                      <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-text-main dark:text-white">
                         <span className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-primary">medical_services</span>
                            Doctor & Prescription <span className="text-xs text-gray-400 font-normal ml-1">(Optional)</span>
                         </span>
                         <span className="material-symbols-rounded transition-transform duration-300 group-open:rotate-180">expand_more</span>
                      </summary>
                      <div className="p-4 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-700">
                         <div className="pt-4">
                            <input type="text" value={user.doctorName || ''} onChange={e => handleChange('doctorName', e.target.value)} className="w-full rounded-lg bg-gray-50 dark:bg-gray-900 border-none ring-1 ring-gray-200 dark:ring-gray-700 h-10 px-3 text-sm text-text-main dark:text-white" placeholder="Dr. Name" />
                         </div>
                         <div>
                            <label className="flex items-center justify-center w-full h-24 px-4 transition bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-lg cursor-pointer hover:border-primary">
                               <span className="flex items-center space-x-2">
                                  <span className="material-symbols-rounded text-gray-400">cloud_upload</span>
                                  <span className="font-medium text-gray-600 dark:text-gray-300">Click to upload</span>
                               </span>
                               <input type="file" className="hidden" onChange={() => handleChange('prescriptionAttached', true)} />
                            </label>
                            {user.prescriptionAttached && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><span className="material-symbols-rounded text-sm">check_circle</span> File selected</p>}
                         </div>
                      </div>
                   </details>
                 </div>
              </div>
           </section>

           <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>

           <section>
              <h3 className="text-text-main dark:text-white text-lg font-bold mb-4 px-1">Service Type</h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: 'home', icon: 'home_health', label: 'Home Collection', sub: '+ ₹100 for Lab Tests' },
                   { id: 'lab', icon: 'biotech', label: 'Lab Visit', sub: 'No Extra Charge' }
                 ].map((type) => (
                    <label key={type.id} className="cursor-pointer relative">
                       <input type="radio" name="service_type" className="peer sr-only" checked={user.serviceType === type.id} onChange={() => handleChange('serviceType', type.id as any)} />
                       <div className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:shadow-sm group h-full">
                          <div className="flex flex-col items-center gap-2">
                             <span className="material-symbols-rounded text-gray-400 peer-checked:text-primary text-3xl">{type.icon}</span>
                             <div className="text-center">
                                <span className="block font-bold text-sm text-gray-600 dark:text-gray-300 peer-checked:text-text-main dark:peer-checked:text-white">{type.label}</span>
                                <span className="block text-[10px] text-gray-400 font-medium mt-1">{type.sub}</span>
                             </div>
                          </div>
                       </div>
                    </label>
                 ))}
              </div>
              {user.serviceType === 'home' && (
                <div className="mt-4 animate-fade-in">
                    <label className="text-gray-700 dark:text-gray-300 text-sm font-medium ml-1">Complete Address</label>
                    <textarea
                        value={user.address || ''}
                        onChange={e => handleChange('address', e.target.value)}
                        className="w-full mt-2 rounded-xl bg-white dark:bg-surface-dark border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary p-4 text-text-main dark:text-white h-24 resize-none transition-shadow"
                        placeholder="House No, Street, Landmark, Pincode..."
                    ></textarea>
                </div>
              )}
           </section>
           
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
                         <span className="material-symbols-rounded mb-1 text-gray-400 peer-checked:text-text-main text-2xl">{slot.icon}</span>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-200 peer-checked:text-text-main">{slot.label}</span>
                         <span className="text-xs text-gray-500 dark:text-gray-400 peer-checked:text-text-main">{slot.sub}</span>
                      </div>
                   </label>
                ))}
             </div>
           </section>

           {/* Payment Summary */}
           <section className="bg-white dark:bg-surface-dark rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
             <h3 className="text-base font-bold mb-3 text-text-main dark:text-white">Bill Details</h3>
             <div className="space-y-2">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
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
                 <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                 <div className="flex justify-between items-center font-bold text-base">
                   <span className="text-text-main dark:text-white">To Pay</span>
                   <span className="text-text-main dark:text-white">₹{finalTotal}</span>
                 </div>
             </div>
           </section>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 p-4 pb-8 shadow-soft z-50">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total to pay</span>
            <span className="text-2xl font-extrabold text-text-main dark:text-white">₹{finalTotal}</span>
          </div>
          <button 
            onClick={handlePlaceOrder} 
            disabled={isProcessing}
            className={`flex-1 bg-primary hover:bg-primary-dark text-white font-bold text-base h-14 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
             {isProcessing ? (
               <>
                 <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 Processing...
               </>
             ) : (
               <>
                 <span className="material-symbols-rounded">shopping_bag</span> Place Order
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;