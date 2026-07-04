import type { Inquiry, ScrapMaterial, UserScrap } from './types';

export const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-1',
    customerName: 'Ali Khan',
    customerEmail: 'ali.khan@example.com',
    materialType: 'Copper Wire',
    weight: '20 kg',
    date: 'Today, 10:00 AM',
    status: 'Pending Review',
  },
];

export const MAP_PINS = [
  { id: 'p1', x: '30%', y: '40%', label: 'Sector A', type: 'rider' as const },
  { id: 'p2', x: '55%', y: '25%', label: 'Sector B', type: 'rider' as const },
  { id: 'p3', x: '70%', y: '55%', label: 'Sector C', type: 'customer' as const },
  { id: 'p4', x: '20%', y: '65%', label: 'Sector D', type: 'customer' as const },
];

export const MATERIALS: ScrapMaterial[] = [
  {
    id: 'copper',
    name: 'Copper',
    category: 'Metals',
    rate: 12.5,
    unit: 'kg',
    iconName: 'Truck',
    bgLight: '#0ea5e91a',
    color: '#0ea5e9',
  },
];

export const DEFAULT_USER_SCRAPS: UserScrap[] = [];

