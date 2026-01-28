import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, TestItem, Coupon, UserDetails, Order, B2BUser, CenterPrice, Patient } from './types';
import { MOCK_TESTS, MOCK_COUPONS, MOCK_DOCTORS } from './data';
import { api } from './services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  tests: TestItem[];
  doctors: TestItem[];
  isLoading: boolean;
  fetchTests: () => Promise<void>;
  fetchDoctors: () => Promise<void>;
  user: UserDetails;
  updateUser: (details: Partial<UserDetails>) => void;
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  orders: Order[];
  fetchUserOrders: () => Promise<void>;
  addOrder: (order: Order) => void;
  b2bUser: B2BUser | null;
  loginB2B: (user: B2BUser) => void;
  logoutB2B: () => void;
  cart: CartItem[];
  addToCart: (item: TestItem, centerIndex: number, slotDate?: string, slotTime?: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;
  getCartTotal: () => { subtotal: number; discount: number; homeCollectionCharges: number; finalTotal: number };
}

const mapWPDataToTestItem = (item: any, type: 'test' | 'scan' | 'package' | 'doctor'): TestItem => {
  const acf = item.acf || {};
  const price = acf.price ? Number(acf.price) : 1000;
  const mrp = acf.mrp ? Number(acf.mrp) : Math.round(price * 1.2);
  const defaultCenter: CenterPrice = {
    centerName: type === 'doctor' ? (acf.clinic_name || 'Main Clinic') : 'Main Lab',
    price: price,
    mrp: mrp,
    rating: 4.8,
    reviews: 120,
    accredited: true,
    tat: acf.report_time || (type === 'doctor' ? 'N/A' : '24 Hours'),
    location: acf.location || 'Central'
  };
  const description = item.content?.rendered?.replace(/<[^>]+>/g, '') || item.title?.rendered || '';
  return {
    id: item.id.toString(),
    name: item.title?.rendered || 'Unknown Item',
    type: type,
    category: acf.category || (type === 'scan' ? 'Scans' : type === 'package' ? 'Packages' : type === 'doctor' ? 'General Physician' : 'General'),
    description: description,
    shortDescription: item.excerpt?.rendered?.replace(/<[^>]+>/g, '') || description.substring(0, 100),
    preparation: acf.preparation || 'No specific preparation',
    sampleType: acf.sample_type || 'N/A',
    reportTime: acf.report_time || '24 Hours',
    parametersCount: 1, 
    imageUrl: acf.image_url || 'https://picsum.photos/400/200',
    centers: [defaultCenter],
    isNabl: true,
    tags: [],
    specialty: acf.specialty || '',
    experience: acf.experience || '',
    about: acf.about || description,
    
    // New mappings
    organ: acf.organ || '',
    condition: acf.condition || '',
    risk_factor: acf.risk_factor || ''
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
      toasts: [],
      addToast: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
      tests: [],
      doctors: [],
      isLoading: false,
      fetchTests: async () => {
        set({ isLoading: true });
        try {
          const [testsData, scansData, packagesData, checkupsData] = await Promise.all([
             api.getTests(),
             api.getScans(),
             api.getPackages(),
             api.getCheckups()
          ]);
          const combined = [
            ...(Array.isArray(testsData) ? testsData.map(t => mapWPDataToTestItem(t, 'test')) : []),
            ...(Array.isArray(scansData) ? scansData.map(s => mapWPDataToTestItem(s, 'scan')) : []),
            ...(Array.isArray(packagesData) ? packagesData.map(p => mapWPDataToTestItem(p, 'package')) : []),
            ...(Array.isArray(checkupsData) ? checkupsData.map(c => mapWPDataToTestItem(c, 'package')) : [])
          ];
          if (combined.length === 0) {
            set({ tests: MOCK_TESTS, isLoading: false });
          } else {
            set({ tests: combined, isLoading: false });
          }
        } catch (error) {
          get().addToast("Could not sync latest tests. Loading offline data.", "error");
          set({ tests: MOCK_TESTS, isLoading: false }); 
        }
      },
      fetchDoctors: async () => {
        try {
            const doctors = await api.getDoctors();
            if (doctors && doctors.length > 0) {
                 set({ doctors: doctors.map(d => mapWPDataToTestItem(d, 'doctor')) });
            } else {
                 set({ doctors: MOCK_DOCTORS });
            }
        } catch (e) {
            get().addToast("Doctor directory offline. Showing local cache.", "info");
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
      patients: [],
      addPatient: (patient) => {
        set((state) => ({ patients: [patient, ...state.patients] }));
        get().addToast(`${patient.fullName} added to patients.`, "success");
      },
      removePatient: (id) => {
        set((state) => ({ patients: state.patients.filter(p => p.id !== id) }));
        get().addToast("Patient profile removed.", "info");
      },
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      fetchUserOrders: async () => {
          const { b2bUser } = get();
          if (!b2bUser?.id) return;
          try {
              const wcOrders = await api.getUserOrders(Number(b2bUser.id));
              if (wcOrders && Array.isArray(wcOrders)) {
                  const mappedOrders: Order[] = wcOrders.map((o: any) => ({
                      id: o.id.toString(),
                      date: o.date_created,
                      totalAmount: Number(o.total),
                      status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
                      userDetails: get().user,
                      items: o.line_items.map((li: any) => ({
                          id: li.product_id.toString(),
                          name: li.name,
                          type: 'test',
                          category: 'Ordered',
                          description: '',
                          selectedCenter: {
                              centerName: 'Lab Link',
                              price: Number(li.total),
                              mrp: Number(li.total),
                              rating: 5,
                              reviews: 0,
                              accredited: true,
                              tat: '24h'
                          },
                          centers: [],
                          isNabl: true,
                          cartId: li.id.toString()
                      }))
                  }));
                  set({ orders: mappedOrders });
              }
          } catch (e) {
              get().addToast("Failed to sync booking history.", "error");
          }
      },
      b2bUser: null,
      loginB2B: (user: B2BUser) => {
        set({ b2bUser: user });
        get().addToast(`Logged in as ${user.name}`, "success");
      },
      logoutB2B: () => {
        set({ b2bUser: null, orders: [] });
        get().addToast("Logged out successfully.", "info");
      },
      cart: [],
      addToCart: (item, centerIndex, slotDate, slotTime) => set((state) => {
        const cartItemId = `${item.id}-${centerIndex}`;
        const newItem: CartItem = { 
            ...item, 
            cartId: cartItemId,
            selectedCenter: item.centers[centerIndex],
            appointmentDate: slotDate,
            appointmentSlot: slotTime
        };
        const existingIndex = state.cart.findIndex(i => i.id === item.id);
        get().addToast(`${item.name} added to cart`, "success");
        if (existingIndex >= 0) {
           const updatedCart = [...state.cart];
           updatedCart[existingIndex] = newItem;
           return { cart: updatedCart };
        }
        return { cart: [...state.cart, newItem] };
      }),
      removeFromCart: (itemId) => set((state) => {
        const itemToRemove = state.cart.find(i => i.id === itemId);
        if (itemToRemove) get().addToast(`${itemToRemove.name} removed.`, "info");
        return { cart: state.cart.filter(i => i.id !== itemId) };
      }),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      appliedCoupon: null,
      applyCoupon: (code) => {
        const coupon = MOCK_COUPONS.find(c => c.code === code.toUpperCase());
        const { subtotal } = get().getCartTotal();
        if (!coupon) return 'Invalid coupon code';
        if (subtotal < coupon.minOrderValue) return `Min order of ₹${coupon.minOrderValue} required`;
        set({ appliedCoupon: coupon });
        get().addToast("Coupon applied!", "success");
        return null;
      },
      removeCoupon: () => set({ appliedCoupon: null }),
      getCartTotal: () => {
        const { cart, appliedCoupon, user } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.selectedCenter.price, 0);
        
        // Calculate Home Collection Fee
        // Rule: 100 Rs for tests/packages, not for scans.
        let homeCollectionCharges = 0;
        const hasLabTests = cart.some(item => item.type === 'test' || item.type === 'package');
        
        if (user.serviceType === 'home' && hasLabTests) {
            homeCollectionCharges = 100;
        }

        let discount = 0;
        if (appliedCoupon) {
          discount = appliedCoupon.discountType === 'percent' ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value;
        }
        
        const finalTotal = Math.max(0, subtotal - discount + homeCollectionCharges);
        
        return { subtotal, discount, homeCollectionCharges, finalTotal };
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
        patients: state.patients,
        orders: state.orders,
        b2bUser: state.b2bUser 
      }), 
    }
  )
);