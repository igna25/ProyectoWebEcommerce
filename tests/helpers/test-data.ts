export const ADMIN_USER = {
  email: process.env.TEST_ADMIN_EMAIL || "admin@test.com",
  password: process.env.TEST_ADMIN_PASSWORD || "password123",
};

export const REGULAR_USER = {
  email: process.env.TEST_USER_EMAIL || "user@test.com",
  password: process.env.TEST_USER_PASSWORD || "password123",
};

export const INVALID_CREDENTIALS = {
  email: "noexiste@test.com",
  password: "wrongpassword",
};

export const NEW_PRODUCT = {
  name: "Producto Test Playwright",
  description: "Descripción generada por Playwright",
  price: "99.99",
  stock: "10",
};

export const UPDATED_PRODUCT = {
  name: "Producto Test Editado",
  price: "149.99",
  stock: "5",
};

export const INVALID_PRODUCT = {
  name: "",
  price: "-1",
  stock: "-5",
};

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  cart: "/cart",
  admin: "/admin",
  adminActivos: "/admin/activos",
  adminInactivos: "/admin/inactivos",
  adminVentas: "/admin/ventas",
  adminNuevo: "/admin/nuevo",
  offline: "/offline",
};

export const API = {
  products: "/api/products",
  productById: (id: string) => `/api/products/${id}`,
  productsRecent: "/api/products/recent",
  productsTop: "/api/products/top",
  cart: "/api/cart",
  cartSync: "/api/cart/sync",
  sales: "/api/sales",
  saleById: (id: string) => `/api/sales/${id}`,
  salesUser: "/api/sales/user",
  adminSummary: "/api/admin",
  adminProducts: "/api/admin/products",
  adminProductById: (id: string) => `/api/admin/products/${id}`,
  adminProductStatus: "/api/admin/products/status",
  adminProductStock: "/api/admin/products/stock",
  adminSales: "/api/admin/sales",
  adminSaleById: (id: string) => `/api/admin/sales/${id}`,
};
