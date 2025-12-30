import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { toggleDarkMode, tests, fetchTests, isLoading, user, b2bUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const popularTests = tests.slice(0, 4);
  const trendingPackages = tests.filter(t => t.type === 'package').slice(0, 3);

  const categories = [
    { name: 'Tests', icon: 'biotech', color: 'bg-blue-500' },
    { name: 'Scans', icon: 'radiology', color: 'bg-purple-500' },
    { name: 'Packages', icon: 'inventory_2', color: 'bg-orange-500' },
    { name: 'Doctors', icon: 'stethoscope', color: 'bg-teal-500' },
  ];

  // Derive the display name from logged in partner or guest details
  const rawName = b2bUser ? b2bUser.name : user.fullName;
  const firstName = rawName ? rawName.trim().split(' ')[0] : 'Guest';

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-32 pt-safe">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-text-sub dark:text-gray-400 text-sm font-medium">Welcome back,</p>
          <h1 className="text-2xl font-display font-bold text-text-main dark:text-white">
            {firstName}
          </h1>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center text-text-main dark:text-white transition-transform active:scale-90"
        >
          <span className="material-symbols-rounded">dark_mode</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div 
          onClick={() => navigate('/explore')}
          className="group relative h-14 w-full bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-card border border-white/20 dark:border-white/5 flex items-center px-4 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-rounded text-primary-light text-2xl mr-3">search</span>
          <span className="text-text-sub dark:text-gray-400 font-medium text-sm group-hover:text-text-main transition-colors">Find tests, doctors, or labs...</span>
          <div className="absolute right-2 bg-primary-light/10 dark:bg-primary-light/20 p-2 rounded-xl">
             <span className="material-symbols-rounded text-primary-dark dark:text-primary-light">tune</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="w-full h-48 rounded-[2rem] bg-gradient-to-br from-primary-dark to-black relative overflow-hidden shadow-glow group cursor-pointer">
           {/* Abstract shapes */}
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-light rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-pulse-slow"></div>
           <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
           
           <div className="absolute inset-0 p-6 flex flex-col justify-center z-10">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white w-fit mb-3">
                LIMITED OFFER
              </span>
              <h2 className="text-white text-2xl font-display font-bold leading-tight mb-2 w-2/3">
                Full Body Checkup <br/>
                <span className="text-primary-light">50% Off</span>
              </h2>
              <button className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold w-fit mt-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                Book Now
              </button>
           </div>
           <img src="https://picsum.photos/400/200?blur=2" className="absolute right-0 bottom-0 w-32 h-full object-cover opacity-80 mix-blend-luminosity mask-image-gradient" alt="Banner" />
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex justify-between gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => cat.name === 'Doctors' ? navigate('/doctors') : navigate('/explore', { state: { category: cat.name } })}
              className="flex flex-col items-center gap-2 group min-w-[70px]"
            >
              <div className={`w-16 h-16 rounded-[1.2rem] ${cat.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center transition-all group-active:scale-90`}>
                <span className={`material-symbols-rounded text-[28px] ${cat.color.replace('bg-', 'text-')}`}>{cat.icon}</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-gray-300">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tests - Horizontal Scroll */}
      <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-lg font-display font-bold text-text-main dark:text-white">Popular Tests</h2>
          <Link to="/explore" className="text-primary-dark dark:text-primary-light font-bold text-xs">View All</Link>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar px-6 gap-4 pb-4">
          {isLoading ? (
             [1,2,3].map(i => <div key={i} className="w-48 h-64 rounded-3xl bg-gray-100 dark:bg-white/5 animate-pulse shrink-0"></div>)
          ) : (
            popularTests.map((test) => (
              <Link 
                to={`/details/${test.id}`} 
                key={test.id} 
                className="shrink-0 w-48 bg-white dark:bg-white/5 backdrop-blur-sm p-4 rounded-3xl shadow-card border border-white/40 dark:border-white/5 flex flex-col justify-between group active:scale-[0.98] transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-light/10 flex items-center justify-center text-primary-dark dark:text-primary-light">
                      <span className="material-symbols-rounded">hematology</span>
                    </div>
                    {test.isNabl && <span className="material-symbols-rounded text-blue-500 text-[18px]" title="NABL Verified">verified</span>}
                  </div>
                  <h3 className="font-bold text-text-main dark:text-white leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">{test.name}</h3>
                  <p className="text-[10px] text-text-sub dark:text-gray-400">{test.parametersCount || 1} Parameters</p>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-bold text-lg text-text-main dark:text-white">₹{test.centers[0].price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{test.centers[0].mrp}</span>
                  </div>
                  <button className="w-full h-9 rounded-full bg-text-main dark:bg-white text-white dark:text-black text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1 group-hover:bg-primary-light group-hover:text-black">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Trending Packages - List */}
      <section className="px-6 mb-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-lg font-display font-bold text-text-main dark:text-white mb-4">Curated Packages</h2>
        <div className="flex flex-col gap-4">
          {trendingPackages.map((pkg) => (
             <Link 
              to={`/details/${pkg.id}`} 
              key={pkg.id} 
              className="glass-card rounded-3xl p-4 flex gap-4 items-center group active:scale-[0.98] transition-transform"
             >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
                 <img src={pkg.imageUrl} className="w-full h-full object-cover" alt={pkg.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-main dark:text-white truncate text-base mb-1">{pkg.name}</h3>
                <p className="text-xs text-text-sub dark:text-gray-400 mb-2 line-clamp-1">{pkg.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-text-main dark:text-white">₹{pkg.centers[0].price}</span>
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-text-main dark:text-white">
                     <span className="material-symbols-rounded text-sm">add</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Spacer for Floating Nav */}
      <div className="h-10"></div>
    </div>
  );
};

export default Home;