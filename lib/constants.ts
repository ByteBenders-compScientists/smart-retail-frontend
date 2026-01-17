export const APP_NAME = 'Smart-Retail';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_SHOP: '/customer/shop',
  CUSTOMER_CART: '/customer/cart',
  CUSTOMER_ORDERS: '/customer/orders',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_RESTOCK: '/admin/restock',
  ADMIN_REPORTS: '/admin/reports',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'smart_retail_token',
  USER_DATA: 'smart_retail_user',
  CART_DATA: 'smart_retail_cart',
  SELECTED_BRANCH: 'smart_retail_branch',
} as const;

export const PRODUCTS = {
  COKE: {
    id: 'prod-coke',
    name: 'Coke' as const,
    price: 60,
    description: 'Coca-Cola Original Taste 500ml',
    image: '/images/drinks/coke.png',
    category: 'soft-drink' as const,
  },
  FANTA: {
    id: 'prod-fanta',
    name: 'Fanta' as const,
    price: 60,
    description: 'Fanta Orange 500ml',
    image: '/images/drinks/fanta.png',
    category: 'soft-drink' as const,
  },
  SPRITE: {
    id: 'prod-sprite',
    name: 'Sprite' as const,
    price: 60,
    description: 'Sprite Lemon-Lime 500ml',
    image: '/images/drinks/sprite.png',
    category: 'soft-drink' as const,
  },
} as const;

export const PRODUCT_LIST = [
  PRODUCTS.COKE,
  PRODUCTS.FANTA,
  PRODUCTS.SPRITE,
];

export const MPESA_CONFIG = {
  CONSUMER_KEY: process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY || '',
  CONSUMER_SECRET: process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET || '',
  SHORTCODE: process.env.NEXT_PUBLIC_MPESA_SHORTCODE || '174379',
  PASSKEY: process.env.NEXT_PUBLIC_MPESA_PASSKEY || '',
} as const;