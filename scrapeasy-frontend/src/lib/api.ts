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
export const publicApi = {
  // 👇 OTP SEND (Mobile Signup ke liye)
  sendOtp: async (email: string) => {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  // 👇 OTP VERIFY (Mobile ke liye)
  verifyOtp: async (email: string, token: string) => {
    const response = await api.post('/auth/verify-otp', { email, token });
    return response.data;
  },

  // 👇 Email + Password Login (Admin ke liye)
  signInWithPassword: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (!response || !response.data) {
      throw new Error('Invalid response from server');
    }

    if (!response.data.access_token) {
      throw new Error('Access token missing in response');
    }

    return response.data;
  },

  // 👇 Public Scrap APIs
  getRates: () => api.get('/scrap/rates/today').then((r) => r.data),
  createPickup: (body: Record<string, unknown>) =>
    api.post('/pickups', body).then((r) => r.data),
};