# Backend API Migration Guide

## Overview

This guide explains how the Next.js API routes were converted to FastAPI endpoints, and how to use the new backend.

## Architecture Change

### Before: Next.js API Routes
```
Next.js Frontend
├── app/api/content/features/route.ts
├── app/api/auth/login/route.ts
├── app/api/dashboard/rent-status/route.ts
└── app/api/tenant/pay-rent/route.ts
    ↓
    Served on same port (3000)
```

### After: Separated FastAPI Backend
```
Next.js Frontend (Port 3000)
    ↓ HTTP Requests
FastAPI Backend (Port 8000)
├── routers/content.py
├── routers/auth.py
├── routers/dashboard.py
└── routers/tenant.py
```

## Key Advantages

✅ **Separation of Concerns** - Frontend and backend are independent
✅ **Scalability** - Backend can scale independently
✅ **Language Choice** - Use Python for backend, TypeScript for frontend
✅ **Better Testing** - Easier to test backend and frontend separately
✅ **Easier Deployment** - Deploy backend and frontend independently
✅ **FastAPI Benefits** - Auto API documentation, type safety, fast performance

## API Route Mapping

### Content Routes

| Next.js | FastAPI |
|---------|---------|
| `GET /api/content/features` | `GET http://localhost:8000/api/content/features` |
| `GET /api/content/pricing` | `GET http://localhost:8000/api/content/pricing` |
| `GET /api/content/testimonials` | `GET http://localhost:8000/api/content/testimonials` |
| `GET /api/content/stats` | `GET http://localhost:8000/api/content/stats` |

### Auth Routes

| Next.js | FastAPI |
|---------|---------|
| `GET /api/auth/check` | `GET http://localhost:8000/api/auth/check` |
| `POST /api/auth/login` | `POST http://localhost:8000/api/auth/login` |
| `POST /api/auth/signup` | `POST http://localhost:8000/api/auth/signup` |

### Dashboard Routes

| Next.js | FastAPI |
|---------|---------|
| `GET /api/dashboard/properties` | `GET http://localhost:8000/api/dashboard/properties` |
| `POST /api/dashboard/properties` | `POST http://localhost:8000/api/dashboard/properties` |
| `GET /api/dashboard/rent-status` | `GET http://localhost:8000/api/dashboard/rent-status` |
| `GET /api/dashboard/maintenance` | `GET http://localhost:8000/api/dashboard/maintenance` |
| `POST /api/dashboard/maintenance` | `POST http://localhost:8000/api/dashboard/maintenance` |
| `GET /api/dashboard/deposits` | `GET http://localhost:8000/api/dashboard/deposits` |
| `POST /api/dashboard/deposits` | `POST http://localhost:8000/api/dashboard/deposits` |

### Tenant Routes

| Next.js | FastAPI |
|---------|---------|
| `GET /api/tenant/portal` | `GET http://localhost:8000/api/tenant/portal` |
| `POST /api/tenant/pay-rent` | `POST http://localhost:8000/api/tenant/pay-rent` |
| `POST /api/tenant/maintenance` | `POST http://localhost:8000/api/tenant/maintenance` |
| `GET /api/tenant/move-in-walkthrough` | `GET http://localhost:8000/api/tenant/move-in-walkthrough` |
| `POST /api/tenant/move-in-walkthrough` | `POST http://localhost:8000/api/tenant/move-in-walkthrough` |

## Updating Frontend API Client

### Option 1: Update API Base URL

Update `lib/api.ts` to point to FastAPI backend:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export const api = {
  content: {
    getFeatures: async () => {
      const res = await fetch(`${API_BASE}/content/features`)
      // ...
    },
  },
}
```

### Option 2: Proxy Requests

Configure Next.js to proxy requests to FastAPI backend in `next.config.mjs`:

```javascript
export default {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ],
    }
  },
}
```

This way your frontend code stays the same, requests are forwarded to the FastAPI backend.

## Environment Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:///./rentproof.db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

## Running Both Servers

### Terminal 1: Frontend
```bash
cd /path/to/rentroof
npm run dev
# Frontend runs on http://localhost:3000
```

### Terminal 2: Backend
```bash
cd /path/to/rentroof/backend
source venv/bin/activate
python main.py
# Backend runs on http://localhost:8000
```

## Development Workflow

1. **Start Backend**
   ```bash
   cd backend
   source venv/bin/activate
   python main.py
   ```

2. **Start Frontend** (in another terminal)
   ```bash
   npm run dev
   ```

3. **View API Docs** (while backend is running)
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

4. **Make API Calls**
   ```typescript
   import api from '@/lib/api'
   
   // Frontend automatically calls FastAPI backend
   const features = await api.content.getFeatures()
   ```

## Testing

### Test FastAPI Directly

```bash
# Get features
curl http://localhost:8000/api/content/features

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get rent status
curl http://localhost:8000/api/dashboard/rent-status
```

### Test Through Frontend Proxy

```bash
# Both frontend and backend running
curl http://localhost:3000/api/content/features
```

## Migration Checklist

- [x] Create FastAPI project structure
- [x] Define Pydantic models for type safety
- [x] Create content router with all endpoints
- [x] Create auth router with all endpoints
- [x] Create dashboard router with all endpoints
- [x] Create tenant router with all endpoints
- [x] Configure CORS for frontend communication
- [x] Add environment variable support
- [ ] Integrate with real database
- [ ] Integrate with Firebase Authentication
- [ ] Implement payment processing
- [ ] Add file upload handling
- [ ] Add error logging and monitoring
- [ ] Add rate limiting and security
- [ ] Write tests for all endpoints
- [ ] Deploy to production

## File Structure Comparison

### Before (Next.js only)
```
rentroof/
├── app/
│   ├── api/
│   │   ├── content/features/route.ts
│   │   ├── auth/login/route.ts
│   │   └── dashboard/rent-status/route.ts
│   ├── page.tsx
│   └── layout.tsx
├── components/
├── lib/api.ts
└── package.json
```

### After (Next.js + FastAPI)
```
rentroof/
├── app/                        # Next.js Frontend
│   ├── page.tsx
│   ├── layout.tsx
│   └── ...
├── components/
├── lib/api.ts                  # Points to FastAPI backend
├── package.json
├── backend/                    # FastAPI Backend
│   ├── main.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── content.py
│   │   ├── auth.py
│   │   ├── dashboard.py
│   │   └── tenant.py
│   └── .env
└── README.md
```

## Next Steps

1. **Run Setup Script**
   ```bash
   cd backend
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start Both Servers**
   - Frontend: `npm run dev`
   - Backend: `python main.py`

3. **View API Documentation**
   - http://localhost:8000/docs

4. **Connect Database**
   - Replace mock data with real database queries

5. **Integrate Authentication**
   - Connect to Firebase Authentication

6. **Add Payment Processing**
   - Integrate Stripe or PayPal

## Support

For issues or questions, refer to:
- FastAPI Docs: https://fastapi.tiangolo.com/
- Backend README: `backend/README.md`
- API Documentation: `API_DOCUMENTATION.md`
