# RentProof API Routes Summary

## Quick Reference Guide

### 📋 Landing Page Content Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/content/features` | GET | Get all platform features |
| `/api/content/pricing` | GET | Get pricing plans |
| `/api/content/testimonials` | GET | Get customer testimonials |
| `/api/content/stats` | GET | Get platform statistics |

### 🔐 Authentication Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/check` | GET | Verify user authentication status |
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |

### 📊 Landlord Dashboard Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/dashboard/properties` | GET | Get all properties |
| `/api/dashboard/properties` | POST | Create new property |
| `/api/dashboard/rent-status` | GET | Get rent collection status |
| `/api/dashboard/maintenance` | GET | Get all maintenance requests |
| `/api/dashboard/maintenance` | POST | Create maintenance request |
| `/api/dashboard/deposits` | GET | Get all deposit records |
| `/api/dashboard/deposits` | POST | Record security deposit |

### 🏠 Tenant Portal Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tenant/portal` | GET | Get tenant dashboard data |
| `/api/tenant/pay-rent` | POST | Submit rent payment |
| `/api/tenant/maintenance` | POST | Submit maintenance request |
| `/api/tenant/move-in-walkthrough` | GET | Get move-in walkthrough details |
| `/api/tenant/move-in-walkthrough` | POST | Submit walkthrough photos |

---

## Usage Examples

### Frontend Integration with `lib/api.ts`

```typescript
import api from '@/lib/api'

// Content
await api.content.getFeatures()
await api.content.getPricing()
await api.content.getTestimonials()
await api.content.getStats()

// Auth
await api.auth.checkAuth()
await api.auth.login(email, password)
await api.auth.signup(email, password, name, plan)

// Dashboard
await api.dashboard.getProperties()
await api.dashboard.createProperty(address, city, state, zipCode)
await api.dashboard.getRentStatus()
await api.dashboard.getMaintenance()
await api.dashboard.createMaintenance(unitId, title, description, priority, images)
await api.dashboard.getDeposits()
await api.dashboard.createDeposit(unitId, tenantId, amount, dateReceived)

// Tenant
await api.tenant.getPortal()
await api.tenant.payRent(tenantId, unitId, amount, paymentMethod)
await api.tenant.submitMaintenance(tenantId, unitId, title, description, priority, images)
await api.tenant.getMoveInWalkthrough()
await api.tenant.submitMoveInWalkthrough(tenantId, unitId, roomId, photos)
```

---

## Component Integration Examples

### Example: Features Grid
See `components/landing/FeaturesGrid.example.tsx`
- Fetches features from `/api/content/features`
- Displays feature cards dynamically
- Includes loading and error states

### Example: Rent Dashboard
See `app/dashboard/dashboard-example.tsx`
- Checks authentication via `/api/auth/check`
- Fetches rent status from `/api/dashboard/rent-status`
- Displays rent collection progress and unit details
- Handles redirects for unauthenticated users

### Example: Login Form
See `components/auth/LoginForm.example.tsx`
- Calls `/api/auth/login` endpoint
- Manages form state and loading
- Redirects on successful login

### Example: Tenant Payment Form
See `components/tenant/PayRentForm.example.tsx`
- Calls `/api/tenant/pay-rent` endpoint
- Validates payment amount
- Supports multiple payment methods
- Shows success confirmation

---

## Frontend Routes (Pages)

Your Next.js app routes:
- `/` - Landing page
- `/login` - Login page (`app/login/page.tsx`)
- `/signup` - Signup page (`app/signup/page.tsx`)
- `/dashboard` - Landlord dashboard (`app/dashboard/page.tsx`)
- Any tenant-specific pages

---

## Key Features

### ✅ Content Management
- Dynamic features, pricing, testimonials, and stats
- Easy to update without code changes
- Perfect for marketing/landing page content

### ✅ User Authentication
- Login and signup endpoints
- Auth token management via cookies
- Protected routes with auth check

### ✅ Property Management
- Create and view properties
- Track multiple units per property
- Associate tenants with units

### ✅ Rent Tracking
- Real-time rent collection status
- Unit-level payment tracking
- Monthly collection metrics

### ✅ Maintenance Management
- Maintenance request submission
- Status tracking (open, in-progress, completed)
- Priority levels
- Image attachments

### ✅ Deposit Management
- Deposit recording and tracking
- Move-in/move-out dates
- Legal deadline management
- Return status tracking

### ✅ Tenant Portal
- View rent status and due dates
- Submit rent payments online
- Report maintenance issues
- Complete move-in photo walkthrough
- Access lease documents

### ✅ Move-In Documentation
- Timestamped photos
- Locked/immutable records
- Cryptographic verification certificates
- Evidence export for disputes

---

## Frontend/API Connection Flow

```
User Action
    ↓
Frontend Component
    ↓
api.ts Function Call
    ↓
POST/GET /api/...
    ↓
Next.js Route Handler
    ↓
Database/External Service
    ↓
Response JSON
    ↓
Frontend State Update
    ↓
UI Re-render
```

---

## Next Steps to Complete Implementation

1. **Connect to Database**
   - Replace mock data with Firestore queries
   - Implement user-scoped data filtering

2. **Integrate Firebase**
   - Complete Firebase authentication
   - Use Firebase Auth for session management

3. **Add Payment Processing**
   - Integrate Stripe or PayPal
   - Implement payment verification

4. **Add File Storage**
   - Connect Firebase Storage
   - Handle image uploads and validation

5. **Add Notifications**
   - Email notifications for payments/maintenance
   - SMS alerts for late rent

6. **Add Error Handling**
   - Comprehensive error messages
   - Error logging/monitoring

7. **Add Validation**
   - Input validation on backend
   - Type safety with Zod schemas

8. **Add Testing**
   - Unit tests for endpoints
   - Integration tests
   - Frontend component tests

9. **Add Rate Limiting**
   - Protect endpoints from abuse
   - Implement request throttling

10. **Add Analytics**
    - Track user actions
    - Monitor endpoint performance

---

## File Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── check/route.ts
│   │   ├── login/route.ts
│   │   └── signup/route.ts
│   ├── content/
│   │   ├── features/route.ts
│   │   ├── pricing/route.ts
│   │   ├── stats/route.ts
│   │   └── testimonials/route.ts
│   ├── dashboard/
│   │   ├── deposits/route.ts
│   │   ├── maintenance/route.ts
│   │   ├── properties/route.ts
│   │   └── rent-status/route.ts
│   └── tenant/
│       ├── maintenance/route.ts
│       ├── move-in-walkthrough/route.ts
│       ├── pay-rent/route.ts
│       └── portal/route.ts
├── dashboard/
│   └── page.tsx
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
├── layout.tsx
└── page.tsx
lib/
└── api.ts (Centralized API client)
components/
├── auth/
│   └── LoginForm.example.tsx
├── landing/
│   └── FeaturesGrid.example.tsx
└── tenant/
    └── PayRentForm.example.tsx
```

---

## Testing the APIs

You can test these endpoints using:
- **Postman** - Import the API collection
- **curl** - Command line requests
- **Frontend components** - Built-in testing

Example curl command:
```bash
curl -X GET http://localhost:3000/api/content/features
```

---

For detailed endpoint documentation, see `API_DOCUMENTATION.md`
