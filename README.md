# 🛍️ IAW-Commerce (E-commerce PWA) | `ProyectoWebEcommerce`

### 🚀 Deploy en Vivo (Vercel)

**[https://proyecto-web-vercel.vercel.app/](https://proyecto-web-vercel.vercel.app/)**

---

## 📌 Descripción

IAW-Commerce es una plataforma web de ecommerce desarrollada con **Next.js 14**, **React 18** y **PostgreSQL**. Permite a los usuarios explorar y comprar productos, gestionar su carrito, realizar pagos con MercadoPago, y funciona completamente offline como una Progressive Web App (PWA). Incluye panel administrativo para gestionar productos, visualizar ventas e integración con Cloudinary para imágenes.

---

### 👥 Autores

**Ignacio Martín, Matías Ríos** - Ingeniería de Aplicaciones Web

---

## 📋 Funcionalidades

- **🛒 Catálogo de Productos** - Búsqueda, filtrado y paginación
- **🛒 Carrito de Compras** - Persistencia en BD y sincronización offline
- **💳 Pagos** - Integración MercadoPago con webhook
- **👤 Autenticación** - Login/registro con bcrypt y JWT
- **👨‍💻 Panel Admin** - CRUD de productos, gestión de stock y ventas
- **📱 PWA** - Offline-first con Service Worker, caché inteligente y Background Sync
- **🖼️ Imágenes** - Upload a Cloudinary
- **✅ Testing** - Tests E2E con Playwright
- **🔒 Seguridad** - CSRF protection, prepared statements, tipo-safe

---

## 📦 Instalación y Ejecución

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/proyecto-web-vercel.git
cd proyecto-web-vercel

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
open http://localhost:3000
```
---

## ✅ Testing

```bash
# Ejecutar todos los tests
npm run test

# Con interfaz gráfica
npm run test:ui

# Tests específicos
npx playwright test products-api.spec.ts

# Ver reporte
npm run test:report
```

Tests incluyen:
- ✅ API endpoints (GET, POST, autenticación)
- ✅ Flujos E2E (login, carrito, checkout)
- ✅ Admin operations (crear producto, cambiar stock)
