# How to run

- Clone the repo, install dependencies, then start backend services and frontend locally.

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
