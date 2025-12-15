// WP/WC API Configuration
// Cast import.meta to any to avoid Property 'env' does not exist on type 'ImportMeta'
const env = (import.meta as any).env || {};
// Prioritize VITE_WP_API_BASE, fallback to VITE_WP_API
const WP_API_BASE = env.VITE_WP_API_BASE || env.VITE_WP_API || 'https://your-wordpress-site.com/wp-json'; 
const WC_KEY = env.VITE_WC_KEY || '';
const WC_SECRET = env.VITE_WC_SECRET || '';

// Check if API is properly configured
const isApiConfigured = WP_API_BASE !== 'https://your-wordpress-site.com/wp-json';

export const api = {
  // ---------- AUTH ----------
  login: async (username: string, password: string) => {
    if (!isApiConfigured) {
        console.log("API not configured. Using Mock Login.");
        // Mock login for demo purposes if API not connected
        if (username && password) {
             // Simulate network delay
             await new Promise(resolve => setTimeout(resolve, 800));
             return {
                 token: 'mock-jwt-token-12345',
                 user_id: '1',
                 user_display_name: 'Demo Partner',
                 user_email: username
             };
        }
        return { token: null, message: "API not configured" };
    }

    try {
      const res = await fetch(`${WP_API_BASE}/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      return await res.json();
    } catch (e) {
      console.error("Login Error:", e);
      return { token: null, message: "Network error" };
    }
  },

  getCurrentUser: async (token: string) => {
    if (!isApiConfigured) return { id: 1, name: 'Demo User', email: 'demo@lablink.com' };

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // ---------- LAB DATA (Correct CPT Slugs) ----------
  getTests: async () => {
    if (!isApiConfigured) return []; 

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/tests?per_page=100`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Fetch Tests Error:", e);
      return [];
    }
  },

  getScans: async () => {
    if (!isApiConfigured) return [];

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/scans?per_page=100`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Fetch Scans Error:", e);
      return [];
    }
  },

  getPackages: async () => {
    if (!isApiConfigured) return [];

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/packages?per_page=100`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Fetch Packages Error:", e);
      return [];
    }
  },

  getCheckups: async () => {
    if (!isApiConfigured) return [];

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/checkups?per_page=100`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Fetch Checkups Error:", e);
      return [];
    }
  },

  getDoctors: async () => {
    if (!isApiConfigured) return [];

    try {
      const res = await fetch(`${WP_API_BASE}/wp/v2/doctor?per_page=100`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("Fetch Doctors Error:", e);
      return [];
    }
  },

  // ---------- WOOCOMMERCE ----------
  getProducts: async () => {
    if (!isApiConfigured) return [];

    try {
      const res = await fetch(
        `${WP_API_BASE}/wc/v3/products?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch(e) {
      console.warn("Fetch Products Error:", e);
      return [];
    }
  },

  getUserOrders: async (customerId: number) => {
    if (!isApiConfigured) return [];
    
    try {
      const res = await fetch(
        `${WP_API_BASE}/wc/v3/orders?customer=${customerId}&consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch(e) {
      console.warn("Fetch Orders Error:", e);
      return [];
    }
  },

  createOrder: async (orderData: any) => {
    if (!isApiConfigured) {
        // Mock order creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: Math.floor(Math.random() * 10000) + 5000, status: 'pending' };
    }

    try {
      const res = await fetch(`${WP_API_BASE}/wc/v3/orders`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${WC_KEY}:${WC_SECRET}`),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || res.statusText);
      }
      return await res.json();
    } catch (e: any) {
      console.error("Create Order Error:", e);
      return { id: null, message: e.message || "Order creation failed" };
    }
  }
};