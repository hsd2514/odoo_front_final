// endpoints.js - central API path constants (env-overridable)

export const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH || '/users/login';
export const REGISTER_PATH = import.meta.env.VITE_REGISTER_PATH || '/users/register';

// Catalog
export const CATEGORIES_PATH = import.meta.env.VITE_CATEGORIES_PATH || '/catalog/categories';
export const PRODUCTS_PATH = import.meta.env.VITE_PRODUCTS_PATH || '/catalog/products';

// Roles/Admin
export const ROLES_PATH = import.meta.env.VITE_ROLES_PATH || '/roles';
export const ROLES_ASSIGN_PATH = import.meta.env.VITE_ROLES_ASSIGN_PATH || '/roles/assign';

// Inventory
export const INVENTORY_ITEMS_PATH = import.meta.env.VITE_INVENTORY_ITEMS_PATH || '/inventory/items';

// Rentals/Schedules/Handover
export const SCHEDULES_PATH = import.meta.env.VITE_SCHEDULES_PATH || '/schedules';
export const HANDOVER_QR_PATH = import.meta.env.VITE_HANDOVER_QR_PATH || '/handover_qr';

// Stripe payments
export const PAYMENTS_STRIPE_BASE = import.meta.env.VITE_PAYMENTS_STRIPE_BASE || '/payments/stripe';

// Engagement
export const ENGAGE_PROMOTIONS_PATH = import.meta.env.VITE_ENGAGE_PROMOTIONS_PATH || '/engage/promotions';
export const LOYALTY_BASE_PATH = import.meta.env.VITE_LOYALTY_BASE_PATH || '/engage/loyalty';

// Utility
export const UTILITY_NOTIFICATIONS_PATH = import.meta.env.VITE_UTILITY_NOTIFICATIONS_PATH || '/utility/notifications';


