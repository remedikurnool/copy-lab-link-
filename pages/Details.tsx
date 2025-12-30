import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { tests, addToCart } = useStore();
  const navigate = useNavigate();
  const [selectedCenterIdx, setSelectedCenterIdx] = useState(0);

  const test = tests.find(t => t.id === id);

  if (!test) return <div className="p-8 text-center">Test not found</div>;

  const activeCenter = test.centers[selectedCenterIdx];

  const handleAddToCart = () => {
    addToCart(test, selectedCenterIdx);
    navigate('/cart');
  };

  return (
    <div className="h-full flex flex-col w-full bg-white dark:bg-background-dark relative animate-slide-in-right">
      {/* Immersive Header Image */}
      <div className="h-[40vh] w-full relative shrink-0">
        <img src={test.imageUrl || "https://picsum.photos/400/400"} alt="Test" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
        
        {/* Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-center z-30">
           <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
              <span className="material-symbols-rounded">arrow_back</span>
           </button>
           <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-sm">
              <span className="material-symbols-rounded">favorite</span>
           </button>
        </div>
        
        <div className="absolute bottom-10 left-6 right-6 z-10">
           <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white mb-2 uppercase tracking-wide">
             {test.category}
           </span>
           <h1 className="text-3xl font-display font-bold text-white leading-tight shadow-sm">{test.name}</h1>
        </div>
      </div>

      {/* Content Sheet - Overlaps the image */}
      <div className="flex-1 bg-white dark:bg-background-dark -mt-8 rounded-t-[2rem] relative z-20 overflow-y-auto hide-scrollbar pb-40 animate-slide-up">
         <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
         </div>

         <div className="px-6 py-4 space-y-6">
            {/* Quick Stats */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 min-w-[140px]">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-rounded">schedule</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Report In</p>
                        <p className="text-sm font-bold text-text-main dark:text-white">{activeCenter.tat}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 min-w-[140px]">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <span className="material-symbols-rounded">science</span>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Sample</p>
                        <p className="text-sm font-bold text-text-main dark:text-white">{test.sampleType || 'Blood'}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">About Test</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {test.description}
                </p>
            </div>

            {/* Labs */}
            <div>
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">Select Lab</h3>
                <div className="space-y-3">
                    {test.centers.map((center, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedCenterIdx(idx)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                                selectedCenterIdx === idx 
                                ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10 shadow-glow' 
                                : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedCenterIdx === idx ? 'border-primary-light' : 'border-gray-300'}`}>
                                {selectedCenterIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary-light"></div>}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-text-main dark:text-white">{center.centerName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-bold flex items-center gap-0.5">
                                        4.8 <span className="material-symbols-rounded text-[10px] filled-icon">star</span>
                                    </span>
                                    <span className="text-xs text-gray-500">NABL Accredited</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-text-main dark:text-white">₹{center.price}</p>
                                <p className="text-xs text-gray-400 line-through">₹{center.mrp}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-50">
          <div className="bg-text-main dark:bg-white p-2 pl-6 rounded-[2rem] shadow-float flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Total Price</span>
                <span className="text-xl font-bold text-white dark:text-black">₹{activeCenter.price}</span>
             </div>
             <button 
                onClick={handleAddToCart}
                className="bg-primary-light hover:bg-primary text-black px-8 py-3 rounded-full font-bold text-sm transition-colors"
             >
                Book Now
             </button>
          </div>
      </div>
    </div>
  );
};

export default Details;