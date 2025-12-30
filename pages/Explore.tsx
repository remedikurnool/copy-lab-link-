import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Explore: React.FC = () => {
  const { tests } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Tests');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle passed state from Home
  useEffect(() => {
      if (location.state && location.state.category) {
          setFilter(location.state.category);
      }
  }, [location.state]);

  const categories = ['All Tests', 'Full Body', 'Packages', 'Diabetes', 'Heart', 'Scans'];
  
  const filteredTests = tests.filter(test => {
    let matchesCategory = true;
    if (filter !== 'All Tests') {
        if (filter === 'Packages') {
            matchesCategory = test.type === 'package';
        } else if (filter === 'Scans') {
            matchesCategory = test.type === 'scan';
        } else if (filter === 'Full Body') {
            matchesCategory = test.category === 'Full Body' || test.tags?.includes('Full Body');
        } else {
            matchesCategory = test.category === filter;
        }
    }
    
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col w-full">
       {/* Header */}
       <div className="flex items-center gap-3 px-4 pt-6 pb-2 shrink-0 z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white transition-transform active:scale-95"
          >
             <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h2 className="text-3xl font-display font-bold text-text-main dark:text-white">Explore</h2>
       </div>

       {/* Search */}
       <div className="px-6 py-2 shrink-0">
          <div className="relative">
             <span className="absolute left-4 top-3.5 text-gray-400 material-symbols-rounded">search</span>
             <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white dark:bg-surface-dark/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary-light/50 text-text-main dark:text-white backdrop-blur-md"
             />
          </div>
       </div>

       {/* Filters */}
       <div className="shrink-0 py-2">
         <div className="flex gap-2 px-6 overflow-x-auto hide-scrollbar">
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setFilter(cat)}
               className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                 filter === cat 
                   ? 'bg-text-main dark:bg-white text-white dark:text-black border-transparent shadow-lg transform scale-105' 
                   : 'bg-transparent text-text-sub dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-300'
               }`}
             >
               {cat}
             </button>
           ))}
         </div>
       </div>

       {/* Results List */}
       <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 hide-scrollbar space-y-4">
         {filteredTests.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-text-sub opacity-50">
             <span className="material-symbols-rounded text-4xl mb-2">search_off</span>
             <p>No results found</p>
           </div>
         ) : (
           filteredTests.map((test, index) => (
             <Link 
               to={`/details/${test.id}`} 
               key={test.id} 
               className="block bg-white dark:bg-surface-dark/40 backdrop-blur-md rounded-[1.5rem] p-1 shadow-card border border-white/40 dark:border-white/5 animate-slide-up hover:bg-white/80 dark:hover:bg-surface-dark/60 transition-colors"
               style={{ animationDelay: `${index * 0.05}s` }}
             >
               <div className="flex gap-4 p-3">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                     test.type === 'scan' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' :
                     test.type === 'package' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600' :
                     'bg-teal-50 dark:bg-teal-900/20 text-teal-600'
                 }`}>
                   <span className="material-symbols-rounded text-2xl">
                     {test.type === 'scan' ? 'radiology' : 
                      test.type === 'package' ? 'inventory_2' : 
                      'biotech'}
                   </span>
                 </div>
                 
                 <div className="flex-1 min-w-0 py-1">
                   <div className="flex justify-between items-start">
                     <h3 className="text-text-main dark:text-white font-bold text-sm truncate pr-2">{test.name}</h3>
                     <span className="text-text-main dark:text-white font-bold text-sm">₹{test.centers[0].price}</span>
                   </div>
                   <p className="text-xs text-text-sub dark:text-gray-400 line-clamp-2 mt-1">{test.shortDescription || test.description}</p>
                 </div>
               </div>
               
               <div className="px-3 pb-3 flex justify-between items-center mt-1">
                  <span className="text-[10px] bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-lg font-medium">{test.category}</span>
                  <div className="text-xs font-bold text-primary-dark dark:text-primary-light flex items-center gap-1">
                    Book <span className="material-symbols-rounded text-sm">arrow_forward</span>
                  </div>
               </div>
             </Link>
           ))
         )}
       </div>
    </div>
  );
};

export default Explore;