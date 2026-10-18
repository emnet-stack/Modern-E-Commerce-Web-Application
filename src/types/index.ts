export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export type UserRole = "customer" | "admin";

// The API also returns a `password` field on users. We intentionally do not
// type it so it can never be displayed by accident.
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface EmailAvailabilityResponse {
  isAvailable: boolean;
}

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string | null;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface ProductInput {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface CategoryInput {
  name: string;
  image: string;
}