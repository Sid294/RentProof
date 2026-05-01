```
RentProof Backend Architecture
==============================

┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                       │
│                     (main.py)                                │
│                                                              │
│  • CORS Middleware configured for frontend communication   │
│  • Auto-documentation generation                           │
│  • Request/response validation with Pydantic              │
│  • Async request handling with Uvicorn                    │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Content API    │ │   Auth API       │ │   Dashboard API  │
│ (routers/       │ │ (routers/        │ │ (routers/        │
│  content.py)    │ │  auth.py)        │ │  dashboard.py)   │
│                  │ │                  │ │                  │
│ ✨ 6 Features   │ │ ✨ Login         │ │ ✨ Properties   │
│ ✨ 3 Plans      │ │ ✨ Signup        │ │ ✨ Rent Status  │
│ ✨ Testimonials │ │ ✨ Auth Check    │ │ ✨ Maintenance  │
│ ✨ Statistics   │ │ ✨ Token Mgmt    │ │ ✨ Deposits     │
└──────────────────┘ └──────────────────┘ └──────────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                     ┌──────────────────┐
                     │  Tenant API      │
                     │ (routers/        │
                     │  tenant.py)      │
                     │                  │
                     │ ✨ Portal        │
                     │ ✨ Pay Rent      │
                     │ ✨ Maintenance   │
                     │ ✨ Walkthrough   │
                     └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Models (models.py)                        │
│                                                              │
│  • 70+ Pydantic models for type safety                      │
│  • Content models (Feature, Pricing, etc.)                  │
│  • Auth models (LoginRequest, User, etc.)                   │
│  • Dashboard models (Property, Rent, Maintenance, etc.)    │
│  • Tenant models (Payment, Walkthrough, etc.)              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 Data Persistence Layer (TODO)                │
│                                                              │
│  • Database: Firebase Firestore / PostgreSQL                │
│  • File Storage: Firebase Storage / AWS S3                  │
│  • Authentication: Firebase Auth / JWT                      │
│  • Payment Processing: Stripe / PayPal                      │
└─────────────────────────────────────────────────────────────┘


Detailed Endpoint Map
====================

CONTENT ENDPOINTS (Public - No Auth Required)
═════════════════════════════════════════════

GET /api/content/features
    └─ Returns: List[Feature]
    └─ Data: 6 platform features with icons & descriptions
    └─ Used by: Landing page features section

GET /api/content/pricing  
    └─ Returns: List[PricingPlan]
    └─ Data: 3 pricing tiers (Starter, Growth, Pro)
    └─ Used by: Pricing section, signup flow

GET /api/content/testimonials
    └─ Returns: List[Testimonial]
    └─ Data: 3 customer success stories
    └─ Used by: Testimonials section

GET /api/content/stats
    └─ Returns: List[Stat]
    └─ Data: 3 impact statistics
    └─ Used by: Stats bar section


AUTH ENDPOINTS (Authentication Flow)
════════════════════════════════════

GET /api/auth/check
    └─ Returns: {authenticated: bool, user?: User}
    └─ Purpose: Verify if user is logged in
    └─ Used by: Layout, protected routes

POST /api/auth/login
    └─ Input: {email, password}
    └─ Returns: {success, user, token, redirectUrl}
    └─ Purpose: Authenticate user
    └─ Used by: Login page

POST /api/auth/signup
    └─ Input: {email, password, name, plan}
    └─ Returns: {success, user, token, redirectUrl}
    └─ Purpose: Create new account
    └─ Used by: Signup page


DASHBOARD ENDPOINTS (Landlord Operations)
══════════════════════════════════════════

Properties Management:
├─ GET /api/dashboard/properties
│   └─ Returns: List[Property]
│   └─ Filters: By authenticated user only
│   └─ Data: All properties, units, tenants
│
└─ POST /api/dashboard/properties
    └─ Input: {address, city, state, zipCode}
    └─ Returns: {success, property}
    └─ Purpose: Add new rental property

Rent Tracking:
└─ GET /api/dashboard/rent-status
    └─ Returns: RentStatus
    └─ Data: Monthly collection, per-unit status
    └─ Stats: Total expected, collected, percentage

Maintenance Management:
├─ GET /api/dashboard/maintenance
│   └─ Returns: List[MaintenanceRequest]
│   └─ Data: All maintenance issues with status
│   └─ Statuses: open, in-progress, completed
│
└─ POST /api/dashboard/maintenance
    └─ Input: {unitId, title, description, priority, images}
    └─ Returns: {success, request}
    └─ Purpose: Create/assign maintenance request

Deposit Management:
├─ GET /api/dashboard/deposits
│   └─ Returns: List[Deposit]
│   └─ Data: All deposit records, deadlines, returns
│
└─ POST /api/dashboard/deposits
    └─ Input: {unitId, tenantId, amount, dateReceived}
    └─ Returns: {success, deposit}
    └─ Purpose: Record security deposit


TENANT ENDPOINTS (Tenant Portal)
═════════════════════════════════

Portal Data:
└─ GET /api/tenant/portal
    └─ Returns: TenantPortal
    └─ Data: All tenant information, documents, requests
    └─ Components: Rent, documents, maintenance list

Rent Payment:
└─ POST /api/tenant/pay-rent
    └─ Input: {tenantId, unitId, amount, paymentMethod}
    └─ Returns: {success, payment, receiptUrl}
    └─ Methods: bank transfer, credit card
    └─ Integration: Stripe/PayPal (TODO)

Maintenance Requests:
└─ POST /api/tenant/maintenance
    └─ Input: {tenantId, unitId, title, description, priority, images}
    └─ Returns: {success, request}
    └─ Purpose: Report maintenance issue

Move-In Walkthrough:
├─ GET /api/tenant/move-in-walkthrough
│   └─ Returns: MoveInWalkthrough
│   └─ Data: All rooms, instructions
│
└─ POST /api/tenant/move-in-walkthrough
    └─ Input: {tenantId, unitId, roomId, photos}
    └─ Returns: {success, room, certificate}
    └─ Features: Photo locking, SHA256 hash, timestamp


Request/Response Flow Example
═════════════════════════════

EXAMPLE: Get Rent Status

1. FRONTEND sends request
   ┌──────────────────────────────────────────┐
   │ const status = await                     │
   │   api.dashboard.getRentStatus()          │
   └──────────────────────────────────────────┘
              │
              ▼
2. HTTP REQUEST
   ┌──────────────────────────────────────────┐
   │ GET http://localhost:8000/api/          │
   │     dashboard/rent-status                │
   │                                          │
   │ Headers: {                               │
   │   'Content-Type': 'application/json',   │
   │   'Cookie': 'auth_token=...'             │
   │ }                                        │
   └──────────────────────────────────────────┘
              │
              ▼
3. BACKEND PROCESSES
   ┌──────────────────────────────────────────┐
   │ @router.get("/rent-status")              │
   │ async def get_rent_status():             │
   │   # Verify auth token                    │
   │   # Fetch from database                  │
   │   # Validate with Pydantic               │
   │   return RentStatus(...)                 │
   └──────────────────────────────────────────┘
              │
              ▼
4. JSON RESPONSE
   ┌──────────────────────────────────────────┐
   │ {                                        │
   │   "month": "April 2026",                 │
   │   "totalUnits": 6,                       │
   │   "collectedUnits": 4,                   │
   │   "percentageCollected": 67,             │
   │   "totalRentExpected": 11800,            │
   │   "totalRentCollected": 7450,            │
   │   "units": [                             │
   │     {                                    │
   │       "id": "unit1a",                    │
   │       "unit": "1A",                      │
   │       "tenant": "M. Kowalski",           │
   │       "amount": 1800,                    │
   │       "status": "paid",                  │
   │       "paidDate": "2026-03-31"           │
   │     },                                   │
   │     ...                                  │
   │   ]                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
              │
              ▼
5. FRONTEND RECEIVES
   ┌──────────────────────────────────────────┐
   │ const status = {                         │
   │   month: "April 2026",                   │
   │   totalUnits: 6,                         │
   │   ...                                    │
   │ }                                        │
   │                                          │
   │ // Update component state                │
   │ setRentStatus(status)                    │
   └──────────────────────────────────────────┘


Error Handling Flow
═══════════════════

EXAMPLE: Missing Required Field

1. FRONTEND sends incomplete data
   ┌──────────────────────────────────────────┐
   │ POST /api/dashboard/deposits             │
   │ {                                        │
   │   "tenantId": "tenant123",               │
   │   "amount": 1950                         │
   │   // Missing: dateReceived, unitId       │
   │ }                                        │
   └──────────────────────────────────────────┘
              │
              ▼
2. PYDANTIC VALIDATION FAILS
   ┌──────────────────────────────────────────┐
   │ class DepositCreateRequest:              │
   │   unitId: str          # ❌ MISSING     │
   │   tenantId: str        # ✅ OK          │
   │   amount: float        # ✅ OK          │
   │   dateReceived: str    # ❌ MISSING     │
   └──────────────────────────────────────────┘
              │
              ▼
3. HTTP 422 RESPONSE
   ┌──────────────────────────────────────────┐
   │ Status: 422 Unprocessable Entity         │
   │ {                                        │
   │   "detail": [                            │
   │     {                                    │
   │       "type": "missing",                 │
   │       "loc": ["body", "unitId"],         │
   │       "msg": "Field required"            │
   │     },                                   │
   │     {                                    │
   │       "type": "missing",                 │
   │       "loc": ["body", "dateReceived"],   │
   │       "msg": "Field required"            │
   │     }                                    │
   │   ]                                      │
   │ }                                        │
   └──────────────────────────────────────────┘
              │
              ▼
4. FRONTEND HANDLES ERROR
   ┌──────────────────────────────────────────┐
   │ catch (error) {                          │
   │   // Show validation error to user       │
   │   showError(error.message)               │
   │ }                                        │
   └──────────────────────────────────────────┘


Performance Optimization
════════════════════════

✅ Async/Await
   • All endpoints use async def
   • Non-blocking I/O operations
   • High concurrency support

✅ Response Validation
   • Pydantic automatically validates
   • Only valid data returned
   • Type hints enable IDE autocomplete

✅ CORS Optimization
   • Configured for specific origins
   • Reduces unnecessary headers
   • Faster browser-server communication

✅ Documentation
   • Auto-generated from type hints
   • Reduces API confusion
   • Faster debugging


Deployment Considerations
═════════════════════════

For Production:
• Use PostgreSQL instead of SQLite
• Add environment-based configuration
• Implement proper authentication (JWT/Firebase)
• Enable HTTPS
• Add rate limiting
• Setup database migrations
• Add error logging (Sentry)
• Use gunicorn/uvicorn in production mode
• Setup CI/CD pipeline
• Add monitoring and alerting
```

This architecture diagram is located at the top of the backend structure for easy reference.
