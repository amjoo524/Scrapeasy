import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface DashboardStats {
  total_pickups: number;
  active_sellers: number;
  carbon_saved_kg: number;
  total_revenue: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenue_chart: ChartPoint[];
  pickups_chart: ChartPoint[];
  scrap_distribution: ChartPoint[];
  carbon_chart: ChartPoint[];
}

export interface UserRecord {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  is_active?: boolean;
  vehicle_info?: string;
  created_at?: string;
}

export interface ScrapRate {
  id: string;
  name: string;
  rate_per_kg: number;
  unit: string;
  is_active?: boolean;
  updated_at?: string;
}

// ✅ Admin APIs (Protected by Bearer Token)
export const adminApi = {
  getDashboard: () => api.get<DashboardData>('/admin/dashboard').then((r) => r.data),
  getCustomers: () => api.get<UserRecord[]>('/admin/customers').then((r) => r.data),
  getRiders: () => api.get<UserRecord[]>('/admin/riders').then((r) => r.data),
  getScrapRates: () => api.get<ScrapRate[]>('/admin/scrap/rates').then((r) => r.data),
  updateScrapRates: (rates: { id: string; rate_per_kg: number }[]) =>
    api.put('/admin/scrap/rates', { rates }).then((r) => r.data),
};

// ✅ Public APIs (Auth & Scrap) - OTP removed, Email/Password added
export const publicApi = {
  // 👇 UPDATED: Email + Password Login with Safe Checks
  signInWithPassword: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    // ✅ SAFE CHECK 1: Agar response hi undefined hai
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    // ✅ SAFE CHECK 2: Agar access_token missing hai
    if (!response.data.access_token) {
      throw new Error('Access token missing in response');
    }

    return response.data; // { message, access_token }
  },

  // ✅ Ye public APIs mobile app ke liye rahengi (Scrap rates, Pickup)
  getRates: () => api.get('/scrap/rates/today').then((r) => r.data),
  createPickup: (body: Record<string, unknown>) =>
    api.post('/pickups', body).then((r) => r.data),
};