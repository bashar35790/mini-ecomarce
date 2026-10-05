export type UserRole = "USER" | "ADMIN" | "STAFF";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  isActive?: boolean;
  isBanned?: boolean;
  wishlistProductIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}
