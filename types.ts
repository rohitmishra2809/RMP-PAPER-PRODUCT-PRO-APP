
export type Role = 'Guest' | 'Customer' | 'Admin';

export interface InventoryItem {
  Green: boolean;
  Silver: boolean;
}

export interface Inventory {
  [key: string]: InventoryItem;
}

export interface OrderData {
  item: string;
  gsm: string;
  color: 'Green' | 'Silver';
  bags: number;
  pcs: number;
  deadline: string;
  note: string;
}

export interface UserSession {
  role: Role;
  name: string;
  phone: string;
}
