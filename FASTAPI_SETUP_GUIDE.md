# 🚀 FastAPI Backend Integration Guide

## What's Been Created

I've successfully converted all Next.js API routes to a **FastAPI backend** with the following structure:

### Backend Architecture

```
backend/
├── main.py                 # Main FastAPI application with CORS config
├── models.py              # Pydantic models for type safety (70+ types)
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── routers/
│   ├── content.py         # Features, pricing, testimonials, stats
│   ├── auth.py            # Login, signup, auth check
│   ├── dashboard.py       # Properties, rent status, maintenance, deposits
│   └── tenant.py          # Tenant portal, payments, walkthrough
└── README.md              # Detailed documentation
```

### Key Features

✅ **Type-Safe** - Pydantic models for all requests/responses
✅ **Auto Docs** - Interactive Swagger UI and ReDoc
✅ **CORS Configured** - Works with frontend on different port
✅ **Async** - Built with async/await for performance
✅ **Error Handling** - Proper HTTP status codes and error messages
✅ **Easy to Test** - FastAPI's interactive docs built-in

---

## 🎯 Quick Start

### Step 1: Setup Backend

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

This will:
- Create Python virtual environment
- Install all dependencies
- Set up the project

### Step 2: Run Backend

```bash
# In backend directory
source venv/bin/activate    # Activate virtual environment
python main.py              # Start server on port 8000
```

You'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Step 3: Run Frontend

```bash
# In root directory (new terminal)
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 4: Test Everything

**View API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**Backend is running if you see:**
- http://localhost:8000/health → `{"status": "healthy"}`
- http://localhost:8000/ → API info

---

## 📊 API Endpoints Summary

### Content Endpoints (Public)
```
GET  /api/content/features       → Landing page features
GET  /api/content/pricing        → Pricing plans
GET  /api/content/testimonials   → Customer testimonials
GET  /api/content/stats          → Platform statistics
```

### Auth Endpoints
```
GET  /api/auth/check             → Verify authentication
POST /api/auth/login             → User login
POST /api/auth/signup            → User registration
```

### Dashboard Endpoints (Landlords)
```
GET  /api/dashboard/properties   → Get all properties
POST /api/dashboard/properties   → Create new property
GET  /api/dashboard/rent-status  → Get rent collection status
GET  /api/dashboard/maintenance  → Get maintenance requests
POST /api/dashboard/maintenance  → Create maintenance request
GET  /api/dashboard/deposits     → Get deposit records
POST /api/dashboard/deposits     → Record security deposit
```

### Tenant Endpoints
```
GET  /api/tenant/portal                    → Get tenant dashboard
POST /api/tenant/pay-rent                  → Submit rent payment
POST /api/tenant/maintenance               → Submit maintenance request
GET  /api/tenant/move-in-walkthrough       → Get walkthrough details
POST /api/tenant/move-in-walkthrough       → Submit walkthrough photos
```

---

## 💻 Using the APIs from Frontend

The frontend `lib/api.ts` already configured to use the FastAPI backend:

```typescript
import api from '@/lib/api'

// Content
const features = await api.content.getFeatures()
const pricing = await api.content.getPricing()

// Auth
const loginResult = await api.auth.login(email, password)

// Dashboard
const rentStatus = await api.dashboard.getRentStatus()

// Tenant
const portal = await api.tenant.getPortal()
const paymentResult = await api.tenant.payRent(tenantId, unitId, amount, method)
```

---

## 🔧 Configuration

### Frontend Configuration (.env.local)

```bash
# Create this file in root directory
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Or run:
```bash
chmod +x configure-frontend.sh
./configure-frontend.sh
```

### Backend Configuration (backend/.env)

```
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:///./rentproof.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

---

## 📁 File Structure

```
rentroof/
├── app/                          # Next.js Frontend
│   ├── api/                      # ❌ No longer used (removed from requests)
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   └── page.tsx
├── backend/                      # ✨ NEW FastAPI Backend
│   ├── main.py                   # Main application
│   ├── models.py                 # Pydantic models
│   ├── routers/
│   │   ├── content.py
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   └── tenant.py
│   ├── requirements.txt
│   ├── .env
│   ├── setup.sh
│   └── README.md
├── components/
├── lib/
│   └── api.ts                    # Frontend API client (updated)
├── package.json
├── START.md                      # Quick start guide
├── BACKEND_MIGRATION_GUIDE.md    # Detailed migration info
└── API_DOCUMENTATION.md          # Full API docs
```

---

## 🌍 How It Works

```
┌─────────────────────────────────────────┐
│                                         │
│     Next.js Frontend                    │
│     (Port 3000)                         │
│                                         │
│  1. User clicks "Login"                 │
│  2. Component calls api.auth.login()    │
│  3. Sends HTTP POST request             │
│                ↓                        │
│     http://localhost:8000/api/auth/login
│                                         │
└─────────────────────────────────────────┘
                    ↓
        Network Communication (HTTP)
                    ↓
┌─────────────────────────────────────────┐
│                                         │
│     FastAPI Backend                     │
│     (Port 8000)                         │
│                                         │
│  1. Receives POST request               │
│  2. Validates with Pydantic             │
│  3. Authenticates user                  │
│  4. Returns JSON response               │
│                ↓                        │
│  {                                      │
│    "success": true,                     │
│    "user": {...},                       │
│    "token": "..."                       │
│  }                                      │
│                                         │
└─────────────────────────────────────────┘
                    ↓
        HTTP Response received
                    ↓
     Frontend updates UI and stores auth
```

---

## 🧪 Testing the API

### Option 1: Interactive Docs
Visit http://localhost:8000/docs while backend is running

### Option 2: curl Commands

```bash
# Get features
curl http://localhost:8000/api/content/features

# Get pricing
curl http://localhost:8000/api/content/pricing

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get rent status
curl http://localhost:8000/api/dashboard/rent-status

# Pay rent
curl -X POST http://localhost:8000/api/tenant/pay-rent \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId":"tenant123",
    "unitId":"unit2a",
    "amount":1950,
    "paymentMethod":"bank"
  }'
```

### Option 3: Python httpx

```python
import httpx

async with httpx.AsyncClient() as client:
    # Get features
    response = await client.get("http://localhost:8000/api/content/features")
    print(response.json())
    
    # Login
    response = await client.post(
        "http://localhost:8000/api/auth/login",
        json={"email": "user@example.com", "password": "password123"}
    )
    print(response.json())
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `backend/README.md` | Backend setup and detailed guide |
| `BACKEND_MIGRATION_GUIDE.md` | Migration guide from Next.js to FastAPI |
| `API_DOCUMENTATION.md` | Complete API reference |
| `API_ROUTES_SUMMARY.md` | Quick API reference |
| `START.md` | Quick start instructions |

---

## 🔐 What's Next (Implementation TODO)

### Priority 1: Database & Auth
- [ ] Connect to Firebase Firestore or PostgreSQL
- [ ] Implement real user authentication
- [ ] Hash passwords (bcrypt)
- [ ] JWT token management

### Priority 2: Core Features
- [ ] Integrate Stripe for payments
- [ ] Setup file storage (Firebase Storage/S3)
- [ ] Implement email notifications

### Priority 3: Production Ready
- [ ] Add comprehensive testing
- [ ] Error logging (Sentry)
- [ ] Rate limiting
- [ ] API authentication
- [ ] Deploy to production

---

## 🚨 Common Issues & Solutions

### Issue: "Connection refused" error
**Solution:** Make sure backend is running
```bash
cd backend
source venv/bin/activate
python main.py
```

### Issue: CORS errors in browser console
**Solution:** Check `FRONTEND_URL` in `backend/.env` matches your frontend URL

### Issue: ModuleNotFoundError
**Solution:** Activate virtual environment and reinstall packages
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Port 8000 already in use
**Solution:** Kill the process or use a different port
```bash
# Find process using port 8000
lsof -ti:8000

# Kill it
kill -9 <PID>

# Or start on different port
uvicorn main:app --port 8001
```

---

## 📖 Learn More

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Pydantic Docs:** https://docs.pydantic.dev/
- **Uvicorn Docs:** https://www.uvicorn.org/
- **REST API Best Practices:** https://restfulapi.net/

---

## ✅ Backend Features Implemented

### ✨ Content Management
- ✅ 6 platform features
- ✅ 3 pricing tiers
- ✅ 3 customer testimonials
- ✅ 3 impact statistics

### ✨ Authentication
- ✅ Login endpoint
- ✅ Signup endpoint
- ✅ Auth check endpoint
- ⏳ Firebase integration (TODO)

### ✨ Dashboard
- ✅ Property management
- ✅ Rent status tracking
- ✅ Maintenance requests
- ✅ Deposit management

### ✨ Tenant Portal
- ✅ Tenant dashboard
- ✅ Rent payment submission
- ✅ Maintenance request submission
- ✅ Move-in photo walkthrough
- ✅ Timestamped photo lockdown with certificates

---

## 🎓 Example: Building a Component with Backend

```typescript
'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

export default function PricingPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Calls FastAPI backend automatically
        const data = await api.content.getPricing()
        setPlans(data)
      } catch (error) {
        console.error('Failed to load pricing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id}>
          <h3>{plan.name}</h3>
          <p>${plan.monthlyPrice}/month</p>
          <ul>
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

---

## 🎉 You're All Set!

Your RentProof application now has:

✅ **Separated Frontend** - Next.js on port 3000
✅ **Dedicated Backend** - FastAPI on port 8000
✅ **Type-Safe APIs** - Pydantic models for validation
✅ **Auto Documentation** - Swagger UI at /docs
✅ **Full CORS Support** - Frontend-Backend communication
✅ **Scalable Structure** - Easy to extend with new features

**Ready to start?**

```bash
# Terminal 1: Backend
cd backend && source venv/bin/activate && python main.py

# Terminal 2: Frontend  
npm run dev

# View API docs
# http://localhost:8000/docs
```

Happy coding! 🚀
