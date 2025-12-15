import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, TestItem, Coupon, UserDetails, Order, B2BUser, CenterPrice } from './types';
import { MOCK_TESTS, MOCK_COUPONS, MOCK_DOCTORS } from './data';
import { api } from './services/api';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Data
  tests: TestItem[];
  doctors: TestItem[];
  isLoading: boolean;
  fetchTests: () => Promise<void>;
  fetchDoctors: () => Promise<void>;

  // User & Orders (Patient Context)
  user: UserDetails;
  updateUser: (details: Partial<UserDetails>) => void;
  orders: Order[];
  addOrder: (order: Order) => void;

  // B2B Auth (Partner Context)
  b2bUser: B2BUser | null;
  loginB2B: (user: B2BUser) => void;
  logoutB2B: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: TestItem, centerIndex: number, slotDate?: string, slotTime?: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => string | null; // Returns error message or null if success
  removeCoupon: () => void;

  // Calculated
  getCartTotal: () => { subtotal: number; discount: number; finalTotal: number };
}

// Helper to map WP API response to TestItem
const mapWPDataToTestItem = (item: any, type: 'test' | 'scan' | 'package'): TestItem => {
  // Default values if ACF fields are missing
  const price = item.acf?.price ? Number(item.acf.price) : 1000;
  const mrp = item.acf?.mrp ? Number(item.acf.mrp) : Math.round(price * 1.2);
  
  const defaultCenter: CenterPrice = {
    centerName: 'Main Lab',
    price: price,
    mrp: mrp,
    rating: 4.8,
    reviews: 120,
    accredited: true,
    tat: item.acf?.report_time || '24 Hours',
    location: 'Central'
  };

  // Strip HTML from description
  const description = item.content?.rendered?.replace(/<[^>]+>/g, '') || item.title?.rendered || '';

  return {
    id: item.id.toString(),
    name: item.title?.rendered || 'Unknown Test',
    type: type,
    category: item.acf?.category || (type === 'scan' ? 'Scans' : 'General'), // Fallback category
    description: description,
    shortDescription: item.excerpt?.rendered?.replace(/<[^>]+>/g, '') || description.substring(0, 100),
    preparation: item.acf?.preparation || 'No specific preparation',
    sampleType: item.acf?.sample_type || 'N/A',
    reportTime: item.acf?.report_time || '24 Hours',
    parametersCount: 1, // Default
    imageUrl: item.acf?.image_url || 'https://picsum.photos/400/200',
    centers: [defaultCenter],
    isNabl: true,
    tags: []
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        set((state) => {
          const newMode = !state.darkMode;
          if (newMode) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
          return { darkMode: newMode };
        });
      },

      tests: [],
      doctors: [],
      isLoading: false,
      fetchTests: async () => {
        set({ isLoading: true });
        
        try {
          const [labTests, scans, packages] = await Promise.all([
             api.getLabTests(),
             api.getScans(),
             api.getPackages()
          ]);

          // Check if real API returned data, otherwise fall back to mock (so app doesn't break if API is down/empty)
          if ((!labTests || labTests.length === 0) && (!scans || scans.length === 0)) {
             console.warn("API returned empty data, using MOCK data.");
             set({ tests: MOCK_TESTS, isLoading: false });
             return;
          }

          const mappedTests = Array.isArray(labTests) ? labTests.map((t: any) => mapWPDataToTestItem(t, 'test')) : [];
          const mappedScans = Array.isArray(scans) ? scans.map((s: any) => mapWPDataToTestItem(s, 'scan')) : [];
          const mappedPackages = Array.isArray(packages) ? packages.map((p: any) => mapWPDataToTestItem(p, 'package')) : [];

          set({ tests: [...mappedTests, ...mappedScans, ...mappedPackages], isLoading: false });

        } catch (error) {
          console.error("Failed to fetch data", error);
          set({ tests: MOCK_TESTS, isLoading: false }); // Fallback
        }
      },
      fetchDoctors: async () => {
          if (get().doctors.length === 0) {
              set({ doctors: MOCK_DOCTORS });
          }
      },

      user: {
        fullName: '',
        age: '',
        phone: '',
        gender: 'female',
        serviceType: 'home',
        address: '',
        timeSlot: 'morning'
      },
      updateUser: (details) => set((state) => ({ user: { ...state.user, ...details } })),
      
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      // B2B Auth Logic
      b2bUser: null,
      loginB2B: (user: B2BUser) => {
         set({ b2bUser: user });
      },
      logoutB2B: () => set({ b2bUser: null }),

      cart: [],
      addToCart: (item, centerIndex, slotDate, slotTime) => set((state) => {
        const cartItemId = `${item.id}-${centerIndex}`;
        
        const newItem: CartItem = { 
            ...item, 
            selectedCenter: item.centers[centerIndex],
            appointmentDate: slotDate,
            appointmentSlot: slotTime
        };

        const existingIndex = state.cart.findIndex(i => i.id === item.id);
        
        if (existingIndex >= 0) {
           const updatedCart = [...state.cart];
           updatedCart[existingIndex] = newItem;
           return { cart: updatedCart };
        }
        
        return { cart: [...state.cart, newItem] };
      }),
      removeFromCart: (itemId) => set((state) => ({ 
        cart: state.cart.filter(i => i.id !== itemId) 
      })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),

      appliedCoupon: null,
      applyCoupon: (code) => {
        const coupon = MOCK_COUPONS.find(c => c.code === code.toUpperCase());
        const { subtotal } = get().getCartTotal();
        
        if (!coupon) return 'Invalid coupon code';
        if (subtotal < coupon.minOrderValue) return `Minimum order value of ₹${coupon.minOrderValue} required`;
        
        set({ appliedCoupon: coupon });
        return null;
      },
      removeCoupon: () => set({ appliedCoupon: null }),

      getCartTotal: () => {
        const { cart, appliedCoupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.selectedCenter.price, 0);
        let discount = 0;

        if (appliedCoupon) {
          if (appliedCoupon.discountType === 'percent') {
            discount = (subtotal * appliedCoupon.value) / 100;
          } else {
            discount = appliedCoupon.value;
          }
        }

        const finalTotal = Math.max(0, subtotal - discount);
        
        return { subtotal, discount, finalTotal };
      }
    }),
    {
      name: 'lab-link-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        darkMode: state.darkMode, 
        cart: state.cart,
        appliedCoupon: state.appliedCoupon,
        tests: state.tests, 
        doctors: state.doctors,
        user: state.user,
        orders: state.orders,
        b2bUser: state.b2bUser 
      }), 
    }
  )
);