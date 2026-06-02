export type Temp = 'hot' | 'iced';
export type Syrup = 'none' | 'vanilla' | 'almond';
export type Sweetness = 'none' | 'light' | 'default' | 'extra';
export type Milk = 'none' | 'whole' | 'oat';
export type Caffeine = 'decaf' | 'half-caf' | 'full-caf';
export type OrderStatus = 'pending' | 'in-progress' | 'done';
export type RoastLevel = 'light' | 'medium' | 'medium-dark' | 'dark';

export interface Bean {
  id: string;
  name: string;
  brand: string | null;
  origin: string | null;
  roast_level: RoastLevel | null;
  tasting_notes: string | null;
  picture_url: string | null;
  is_active: number;
  created_at: string;
}

export interface Drink {
  id: string;
  name: string;
  is_active: number;
  default_temp: Temp;
  default_syrup: Syrup;
  default_sweetness: Sweetness;
  default_milk: Milk;
  default_caffeine: Caffeine;
}

export interface SyrupOption {
  id: string;
  name: string;
  is_active: number;
}

export interface Order {
  id: string;
  customer_name: string;
  drink_id: string;
  drink_name?: string;
  bean_id: string | null;
  bean_name?: string | null;
  temp: Temp;
  syrup: Syrup;
  sweetness: Sweetness;
  milk: Milk;
  caffeine: Caffeine;
  special_notes: string | null;
  status: OrderStatus;
  created_at: string;
}

export interface OrderFormData {
  customer_name: string;
  drink_id: string;
  temp: Temp;
  syrup: Syrup;
  sweetness: Sweetness;
  milk: Milk;
  caffeine: Caffeine;
  special_notes?: string;
}
