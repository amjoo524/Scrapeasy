import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

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

// ─── INTERFACES ─────────────────────────────────────────────

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

// ─── PUBLIC APIs (Auth + Mobile) ────────────────────────────

export const publicApi = {
  sendOtp: async (email: string) => {
    const res = await api.post('/auth/send-otp', { email });
    return res.data;
  },

  verifyOtp: async (email: string, token: string) => {
    const res = await api.post('/auth/verify-otp', { email, token });
    return res.data;
  },

  signInWithPassword: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (!res?.data) throw new Error('Invalid response from server');
    if (!res.data.access_token) throw new Error('Access token missing');
    return res.data as { access_token: string };
  },

  getRates: () => api.get('/scrap/rates/today').then(r => r.data),
  createPickup: (body: Record<string, unknown>) =>
    api.post('/pickups', body).then(r => r.data),
};

// ─── ADMIN APIs (Protected) ──────────────────────────────────

export const adminApi = {
  getDashboard: () =>
    api.get<DashboardData>('/admin/dashboard').then(r => r.data),
  getCustomers: () =>
    api.get<UserRecord[]>('/admin/customers').then(r => r.data),
  getRiders: () =>
    api.get<UserRecord[]>('/admin/riders').then(r => r.data),
  getScrapRates: () =>
    api.get<ScrapRate[]>('/admin/scrap/rates').then(r => r.data),
  updateScrapRates: (rates: { id: string; rate_per_kg: number }[]) =>
    api.put('/admin/scrap/rates', { rates }).then(r => r.data),
};