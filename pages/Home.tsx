import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { toggleDarkMode, tests, fetchTests, isLoading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const popularTests = tests.slice(0, 3);
  const mostBookedScans = tests.filter(t => t.type === 'scan' && t.tags?.includes('Most Booked'));
  const packages = tests.filter(t => t.type === 'package').slice(0, 2);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Doctors') {
        navigate('/doctors');
        return;
    }

    const filterMap: Record<string, string> = {
        'Tests': 'All Tests',
        'Scans': 'Scans', 
        'Packages': 'Packages'
    };
    
    navigate('/explore', { state: { category: filterMap[categoryName] || categoryName } });
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[32px] filled-icon">local_hospital</span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white leading-none">LAB LINK</h1>
            <p className="text-[10px] font-medium text-text-sub dark:text-gray-400">Kurnool, India</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 bg-white dark:bg-surface-dark px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 active:scale-95 transition-transform">
            EN <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800 text-text-main dark:text-white hover:bg-gray-50 active:scale-95 transition-transform">
            <span className="material-symbols-outlined filled-icon">dark_mode</span>
          </button>
        </div>
      </header>

      {/* Search Input */}
      <div className="px-4 py-2 sticky top-[68px] z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm pb-4">
        <div className="relative group cursor-pointer" onClick={() => navigate('/explore')}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-text-sub group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input readOnly className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-surface-dark border-none rounded-2xl text-text-main dark:text-white placeholder:text-text-sub focus:ring-2 focus:ring-primary/50 shadow-soft transition-all text-base font-medium cursor-pointer" placeholder="Search tests, doctors, packages..." type="text" />
        </div>
      </div>

      {/* Quick Categories */}
      <div className="pt-2 pb-6">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-6">
          {[
            { name: 'Tests', icon: 'biotech', color: 'text-primary', bg: 'bg-primary/10' },
            { name: 'Scans', icon: 'radiology', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { name: 'Packages', icon: 'inventory_2', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
            { name: 'Doctors', icon: 'stethoscope', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          ].map((cat, i) => (
            <button key={i} onClick={() => handleCategoryClick(cat.name)} className="flex flex-col items-center gap-2 min-w-[72px] group">
              <div className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center group-active:scale-95 transition-transform duration-200 border border-transparent group-hover:border-current ${cat.color}`}>
                <span className={`material-symbols-outlined text-3xl`}>{cat.icon}</span>
              </div>
              <span className="text-xs font-semibold text-text-main dark:text-gray-300 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Banners */}
      <div className="px-4 mb-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 snap-x snap-mandatory">
          <div onClick={() => handleCategoryClick('Full Body')} className="snap-center shrink-0 w-[85%] rounded-2xl bg-gradient-to-r from-[#10221c] to-[#0d3b30] relative overflow-hidden h-44 shadow-lg group cursor-pointer">
             <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{backgroundImage: 'url("https://picsum.photos/400/200?blur=2")'}}></div>
            <div className="absolute inset-0 p-5 flex flex-col justify-center">
              <span className="bg-primary text-text-main text-xs font-bold px-2 py-1 rounded-md w-fit mb-2">LIMITED OFFER</span>
              <h3 className="text-white text-xl font-bold leading-tight mb-1">50% OFF Full Body Checkups</h3>
              <p className="text-gray-300 text-sm mb-4">Comprehensive health analysis at home.</p>
              <button className="bg-white text-text-main px-4 py-2 rounded-full text-sm font-bold w-fit hover:bg-gray-100 transition-colors">Book Now</button>
            </div>
          </div>
           <div onClick={() => navigate('/doctors')} className="snap-center shrink-0 w-[85%] rounded-2xl bg-gradient-to-r from-[#203040] to-[#1a2533] relative overflow-hidden h-44 shadow-lg group cursor-pointer">
             <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{backgroundImage: 'url("https://picsum.photos/400/200?blur=2&random=5")'}}></div>
            <div className="absolute inset-0 p-5 flex flex-col justify-center">
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-md w-fit mb-2">CONSULT NOW</span>
              <h3 className="text-white text-xl font-bold leading-tight mb-1">Book Top Doctors</h3>
              <p className="text-gray-300 text-sm mb-4">Expert advice from the best specialists.</p>
              <button className="bg-white text-text-main px-4 py-2 rounded-full text-sm font-bold w-fit hover:bg-gray-100 transition-colors">Find Doctors</button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tests */}
      <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-lg font-bold text-text-main dark:text-white">Popular Tests</h2>
          <Link to="/explore" className="text-primary font-semibold text-sm hover:text-primary-dark">View All</Link>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4 pb-4 items-stretch">
          {isLoading ? (
            <div className="text-center w-full py-4 text-gray-500">Loading tests...</div>
          ) : (
            popularTests.map((test) => (
              <Link to={`/details/${test.id}`} key={test.id} className="shrink-0 w-44 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-card border border-gray-100 dark:border-gray-800 flex flex-col justify-between relative group active:scale-[0.98] transition-all min-h-[14rem]">
                {test.tags?.includes('Popular') && <div className="absolute top-3 right-3 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">-20%</div>}
                <div className="flex flex-col flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary shrink-0">
                    <span className="material-symbols-outlined">hematology</span>
                  </div>
                  <h3 className="font-bold text-text-main dark:text-white leading-tight mb-1 line-clamp-3">{test.name}</h3>
                  <p className="text-xs text-text-sub dark:text-gray-400 mb-auto">{test.parametersCount || 1} Parameters</p>
                </div>
                <div className="mt-3 shrink-0">
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-bold text-lg text-text-main dark:text-white">₹{test.centers[0].price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{test.centers[0].mrp}</span>
                  </div>
                  <button className="w-full bg-primary hover:bg-primary-dark text-text-main font-bold py-2 rounded-full text-sm transition-colors shadow-sm">
                    Book Now
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

       {/* Most Booked Scans */}
       <section className="mb-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-lg font-bold text-text-main dark:text-white">Most Booked Scans</h2>
          <Link to="/explore" state={{category: 'Scans'}} className="text-primary font-semibold text-sm hover:text-primary-dark">View All</Link>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4 pb-4">
          {mostBookedScans.map((scan) => (
              <Link to={`/details/${scan.id}`} key={scan.id} className="shrink-0 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden group active:scale-[0.98] transition-all flex flex-col">
                <div className="h-28 w-full bg-gray-100 relative shrink-0">
                     <img src={scan.imageUrl} alt={scan.name} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-[10px] text-white font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">schedule</span> {scan.reportTime}</p>
                     </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-text-main dark:text-white leading-tight mb-1 text-sm line-clamp-2">{scan.name}</h3>
                  <p className="text-[10px] text-text-sub dark:text-gray-400 mb-2">{scan.category}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-base text-text-main dark:text-white">₹{scan.centers[0].price}</span>
                    <button className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full w-7 h-7 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))
          }
        </div>
      </section>

      {/* Packages */}
      <section className="mb-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-main dark:text-white">Trending Packages</h2>
        </div>
        <div className="flex flex-col gap-4">
          {packages.map((pkg) => (
             <Link to={`/details/${pkg.id}`} key={pkg.id} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-card border border-gray-100 dark:border-gray-800 flex gap-4 items-center group active:scale-[0.99] transition-transform">
              <div className="w-24 h-24 shrink-0 rounded-xl bg-gray-100 bg-cover bg-center" style={{backgroundImage: `url(${pkg.imageUrl})`}}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-bold text-text-main dark:text-white truncate pr-2">{pkg.name}</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">SAFE</span>
                </div>
                <p className="text-xs text-text-sub dark:text-gray-400 mb-2 line-clamp-2">{pkg.shortDescription}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[14px]">science</span> {pkg.parametersCount} Tests
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-text-main dark:text-white">₹{pkg.centers[0].price} <span className="text-xs text-gray-400 line-through font-normal">₹{pkg.centers[0].mrp}</span></span>
                  <button className="bg-text-main dark:bg-white dark:text-text-main text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-black transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WhatsApp FAB */}
      <a href="https://wa.me/919429690055" target="_blank" rel="noreferrer" className="fixed bottom-24 right-4 z-50 bg-[#25D366] hover:bg-[#20b858] text-white rounded-full p-3.5 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-90 flex items-center justify-center">
        <span className="material-symbols-outlined text-2xl filled-icon">chat</span>
      </a>
    </div>
  );
};

export default Home;