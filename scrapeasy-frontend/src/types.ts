export type ScreenType = 'home' | 'admin' | 'profile' | 'pickup' | 'history';

export interface ScrapMaterial {
  id: string;
  name: string;
  category: string;
  rate: number;
  unit: string;
  iconName: string;
  bgLight: string;
  color: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  materialType: string;
  weight: string;
  date: string;
  status: 'Pending Review' | 'Assigned' | 'Completed';
}

export interface UserScrap {
  id: string;
  category: string;
  sellerName: string;
  date: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  photos: string[];
  description: string;
  weight: number;
  expectedPrice: number;
  location: string;
}

