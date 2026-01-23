export interface User {
    postalCode: string;
    city: string;
    address: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'admin';
    createdAt: string;
  }
  
  export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
    message: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }