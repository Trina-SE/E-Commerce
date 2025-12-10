# How to run

- Clone the repo, install dependencies, then start backend services and frontend locally.
- cd E-Commerce
- Create .env file, paste the txt here:

# MongoDB Connection
MONGODB_URI=mongodb+srv://bsse1313_db_user:ysBLhzRzTCS3Npnh@cluster0.tajwbzc.mongodb.net/?appName=Cluster0

# JWT
JWT_SECRET=ecommerce_jwt_secret_key_2025_change_in_production

# Gateway
GATEWAY_PORT=5000
GATEWAY_HOST=localhost

# Auth Service
AUTH_SERVICE_PORT=5001
AUTH_SERVICE_HOST=localhost

# Products Service
PRODUCTS_SERVICE_PORT=5002
PRODUCTS_SERVICE_HOST=localhost

# Orders Service
ORDERS_SERVICE_PORT=5003
ORDERS_SERVICE_HOST=localhost

# Payments Service
PAYMENTS_SERVICE_PORT=5004
PAYMENTS_SERVICE_HOST=localhost

# Users Service
USERS_SERVICE_PORT=5005
USERS_SERVICE_HOST=localhost

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api

# Stripe (optional for payments)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here

- Commands to run (PowerShell / Windows):

```powershell
cd 'C:\Users\sulta\Documents\E-Commerce'
# Install dependencies for all projects (optional)
npm run install:all

# Start API Gateway
cd gateway
npm run dev

# In separate terminals, start each service (auth, products, orders, payments, users):
cd services/auth && npm run dev
cd services/products && npm run dev
cd services/orders && npm run dev
cd services/payments && npm run dev
cd services/users && npm run dev

# Finally, start frontend in its folder
cd frontend
npm run dev
```

Open the frontend at: `http://localhost:3000` (the frontend proxies API requests to `http://localhost:5000/api`).
