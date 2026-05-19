# LocalStore Platform

Full-stack multi-vendor platform where users register, create a public shopping or grocery store, manage products, and render the public storefront through selectable React themes.

## Architecture

```text
localstore-platform/
  backend/                 Express API, Sequelize models, JWT auth, Cloudinary uploads
  frontend/                React + Vite + Tailwind storefront and dashboard
  database/schema.sql      MySQL schema for free-tier compatible hosts
  render.yaml              Render free-tier backend blueprint
```

## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Framer Motion, React Helmet Async
- Backend: Node.js, Express, JWT, Multer, Cloudinary
- Database: MySQL with Sequelize ORM
- Deployment: Vercel or Netlify frontend, Render backend, PlanetScale/Railway/Aiven MySQL

## Local Setup

1. Create a MySQL database:

```sql
CREATE DATABASE localstore_platform;
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Update `backend/.env` with your MySQL credentials and a strong `JWT_SECRET`.

5. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## Seed Data

```bash
npm run seed
```

Demo login:

```text
owner@localstore.test
password123
```

Demo public store:

```text
http://localhost:5173/store/urban-daily-store
```

## API Overview

Base URL: `/api`

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `GET /auth/me`
- `GET /themes`
- `POST /themes`
- `GET /stores`
- `POST /stores`
- `GET /stores/:id`
- `PUT /stores/:id`
- `PATCH /stores/:id/sections`
- `DELETE /stores/:id`
- `GET /stores/slug/:slug`
- `GET /stores/public/:slug`
- `GET /stores/:storeId/products`
- `POST /stores/:storeId/products`
- `PUT /products/:productId`
- `DELETE /products/:productId`
- `POST /uploads/stores/:storeId`
- `POST /uploads/products/:productId`

## Store Themes

Theme keys map to lazy React components:

- `modern-shopping` -> `ModernShoppingTheme`
- `minimal` -> `MinimalTheme`
- `grocery` -> `GroceryTheme`
- `premium-catalog` -> `PremiumCatalogTheme`

The public store endpoint returns the store, theme, products, categories, and pagination metadata. The frontend chooses the component dynamically from `frontend/src/pages/PublicStore.jsx`.

## Required Environment Variables

Backend:

```text
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_NAME=localstore_platform
DB_USER=root
DB_PASSWORD=
DB_SSL=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend:

```text
VITE_API_URL=http://localhost:5000/api
VITE_PUBLIC_URL=http://localhost:5173
```

## Free Deployment Guide

### Database: PlanetScale, Railway MySQL, or Aiven

1. Create a free MySQL database.
2. Copy host, port, database name, user, and password.
3. If the provider requires TLS, set `DB_SSL=true`.
4. Run `database/schema.sql` if you prefer manual schema creation, or let Sequelize sync tables when the backend starts.

### Images: Cloudinary

1. Create a free Cloudinary account.
2. Copy cloud name, API key, and API secret.
3. Add them to Render environment variables.

### Backend: Render

1. Push this project to GitHub.
2. In Render, create a new Web Service or use `render.yaml`.
3. Set root directory to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all backend environment variables.
7. Set `CLIENT_URL` to the deployed frontend URL.

### Frontend: Vercel

1. Import the GitHub repository.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL=https://your-render-api.onrender.com/api`
6. Deploy.

### Frontend: Netlify

1. Import the GitHub repository.
2. Set base directory to `frontend`.
3. Build command: `npm run build`
4. Publish directory: `frontend/dist`
5. Set `VITE_API_URL` to the Render API URL.

## Production Notes

- Use a long random `JWT_SECRET`.
- Configure a real email provider before sending password reset emails. The current reset endpoint stores a reset token and only returns it outside production for development.
- Cloudinary upload falls back to placeholder images when Cloudinary credentials are not configured.
- Add checkout/order payment handling when moving beyond WhatsApp-led ordering.
