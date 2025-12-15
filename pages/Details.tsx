import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { CenterPrice } from '../types';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tests, addToCart } = useStore();
  const navigate = useNavigate();
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);

  const test = tests.find(t => t.id === id);

  if (!test) return <div className="p-4">Test not found</div>;

  const activeCenter = test.centers[selectedCenterIdx];

  const handleAddToCart = () => {
    addToCart(test, selectedCenterIdx);
    navigate('/cart');
  };

  return (
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">arrow_back</span>
        </button>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">Test Details</h2>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">share</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        {/* Hero Image */}
        <div className="px-4 pt-2 pb-4">
          <div className="w-full aspect-[2/1] rounded-2xl bg-gray-100 dark:bg-surface-dark overflow-hidden relative shadow-sm">
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
            <img src={test.imageUrl || "https://picsum.photos/400/200"} alt="Test" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-3 z-20 flex gap-2">
              {test.isNabl && (
                <span className="px-2 py-1 text-xs font-bold bg-white/90 text-gray-900 rounded-lg backdrop-blur-sm shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary filled-icon">verified</span>
                  NABL Accredited
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
             <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-primary/20 dark:text-primary dark:bg-primary/10 rounded-full">{test.preparation}</span>
             <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30 rounded-full">Reports in {activeCenter.tat}</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white mb-2">{test.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{test.description}</p>
        </div>

        {/* Lab Selection (Package Variant Style) */}
        <div className="px-4 py-4">
          <div className="p-4 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select Lab</h3>
            {test.centers.map((center, idx) => (
              <label key={idx} className={`flex items-center justify-between p-3 mb-3 border rounded-xl cursor-pointer relative overflow-hidden transition-all ${selectedCenterIdx === idx ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <input type="radio" name="lab_select" className="sr-only" checked={selectedCenterIdx === idx} onChange={() => setSelectedCenterIdx(idx)} />
                <div className="flex items-center gap-3">
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCenterIdx === idx ? 'border-primary bg-white dark:bg-surface-dark' : 'border-gray-300 dark:border-gray-600'}`}>
                      {selectedCenterIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>}
                   </div>
                   <div>
                     <p className="font-bold text-gray-900 dark:text-white">{center.centerName}</p>
                     <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        Reports in {center.tat}
                     </p>
                   </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{center.price}</span>
                    {center.mrp > center.price && <span className="text-xs text-gray-400 line-through">₹{center.mrp}</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="h-2 bg-gray-100 dark:bg-gray-800/50"></div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
           <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-surface-dark rounded-xl">
              <span className="material-symbols-outlined text-primary mb-1">water_drop</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Sample Type</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{test.sampleType || 'Blood'}</span>
           </div>
           <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-surface-dark rounded-xl">
              <span className="material-symbols-outlined text-primary mb-1">no_food</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Preparation</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{test.preparation}</span>
           </div>
        </div>
        
        {/* Trust Signals */}
        <div className="px-4 py-6 bg-gray-50 dark:bg-surface-dark/50 mt-2">
            <div className="flex justify-between items-center text-center">
                <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-primary">security</span>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">100% Safe</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-primary">science</span>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">NABL Labs</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-primary">support_agent</span>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">Expert Support</span>
                </div>
            </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 shadow-soft max-w-md mx-auto">
         <div className="flex gap-3">
             <button className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-transparent text-gray-900 dark:text-white text-sm font-bold active:bg-gray-50 transition-colors">
                 <span className="material-symbols-outlined text-lg">compare_arrows</span> Compare
             </button>
             <button onClick={handleAddToCart} className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-dark text-black text-sm font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all">
                 <span className="material-symbols-outlined text-lg">shopping_cart</span> Add to Cart
             </button>
         </div>
      </div>
    </div>
  );
};

export default Details;