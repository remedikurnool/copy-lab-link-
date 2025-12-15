import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Link, useLocation } from 'react-router-dom';

const Explore: React.FC = () => {
  const { tests } = useStore();
  const location = useLocation();
  const [filter, setFilter] = useState('All Tests');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle passed state from Home
  useEffect(() => {
      if (location.state && location.state.category) {
          setFilter(location.state.category);
      }
  }, [location.state]);

  const categories = ['All Tests', 'Diabetes', 'Heart', 'Kidney', 'Thyroid', 'Full Body', 'Packages', 'Scans'];
  
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
    <div className="h-full flex flex-col w-full bg-background-light dark:bg-background-dark">
       {/* Sticky Header Section */}
       <div className="shrink-0 z-20 bg-background-light dark:bg-background-dark shadow-sm">
           {/* Header */}
           <div className="flex items-center p-4 pb-2 justify-between">
              <h2 className="text-text-main dark:text-white text-2xl font-bold leading-tight tracking-tight flex-1">Explore</h2>
              <div className="flex items-center justify-end">
                <div className="flex items-center justify-center rounded-full size-10 bg-white dark:bg-surface-dark shadow-sm text-text-main dark:text-white">
                  <span className="material-symbols-outlined text-[24px]">search</span>
                </div>
              </div>
            </div>

            {/* Search Bar - Inline */}
            <div className="px-4 pb-2">
               <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tests, scans..."
                  className="w-full bg-white dark:bg-surface-dark border-none rounded-xl py-3 px-4 text-sm shadow-sm focus:ring-2 focus:ring-primary/50 text-text-main dark:text-white"
               />
            </div>

            {/* Filter Chips */}
            <div className="pb-3">
              <div className="flex gap-3 px-4 py-2 overflow-x-auto hide-scrollbar">
                {categories.map(cat => (
                  <div 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-5 pr-5 cursor-pointer transition-colors border ${
                      filter === cat 
                        ? 'bg-primary border-primary shadow-sm shadow-primary/30' 
                        : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <p className={`text-sm font-medium leading-normal ${filter === cat ? 'text-background-dark font-semibold' : 'text-text-main dark:text-gray-300'}`}>
                      {cat}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-1 flex items-center justify-between text-xs text-text-sub">
                <span>Showing {filteredTests.length} results</span>
                <span className="flex items-center gap-1 cursor-pointer"><span className="material-symbols-outlined text-[14px]">sort</span> Sort by: Popular</span>
              </div>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 flex flex-col gap-4 hide-scrollbar bg-background-light dark:bg-background-dark">
          {filteredTests.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No tests found matching your criteria.</div>
          ) : (
            filteredTests.map((test) => (
              <Link to={`/details/${test.id}`} key={test.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-card border border-gray-100 dark:border-gray-800 flex flex-col gap-3 relative overflow-visible group active:scale-[0.99] transition-transform z-0">
                <div className="flex items-start gap-3">
                  {/* Icon Box */}
                  <div className={`flex items-center justify-center rounded-2xl shrink-0 size-14 text-2xl ${
                      test.type === 'scan' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' :
                      test.type === 'package' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600' :
                      'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined">
                      {test.type === 'scan' ? 'radiology' : 
                       test.type === 'package' ? 'inventory_2' : 
                       test.category === 'Heart' ? 'cardiology' : 
                       test.category === 'Kidney' ? 'nephrology' : 'biotech'}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-text-main dark:text-white text-base font-bold leading-tight line-clamp-2">{test.name}</h3>
                      <span className="shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide whitespace-nowrap">{test.category}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">{test.shortDescription || test.description}</p>
                  </div>
                </div>

                {/* Pricing Strip */}
                <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-3 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Best Price</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-text-main dark:text-white">₹{test.centers[0].price}</span>
                        {test.centers[0].mrp > test.centers[0].price && (
                            <span className="text-xs text-gray-400 line-through decoration-gray-400">₹{test.centers[0].mrp}</span>
                        )}
                    </div>
                  </div>
                  
                  <button className="flex items-center gap-1 text-primary text-xs font-bold bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm">
                      View <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
    </div>
  );
};

export default Explore;