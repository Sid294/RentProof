# RentProof API Documentation

## Base URL
```
/api
```

All endpoints are relative to this base URL.

---

## Content Endpoints

### Get Features
```
GET /api/content/features
```
Returns all platform features with descriptions and icons.

**Response:**
```json
[
  {
    "id": "rent-tracking",
    "tag": "Rent tracking",
    "title": "Payment status at a glance",
    "description": "...",
    "icon": "chart-dots"
  },
  ...
]
```

### Get Pricing
```
GET /api/content/pricing
```
Returns all pricing plans with features and pricing details.

**Response:**
```json
[
  {
    "id": "starter",
    "name": "Starter",
    "monthlyPrice": 19,
    "annualPrice": 228,
    "unitLimit": 5,
    "features": [...],
    "link": "/signup?plan=starter"
  },
  ...
]
```

### Get Testimonials
```
GET /api/content/testimonials
```
Returns customer testimonials.

**Response:**
```json
[
  {
    "id": 1,
    "quote": "...",
    "author": "David K.",
    "role": "Landlord -- 4 units -- Indianapolis, IN",
    "category": "deposit-dispute"
  },
  ...
]
```

### Get Stats
```
GET /api/content/stats
```
Returns platform statistics and impact metrics.

**Response:**
```json
[
  {
    "id": 1,
    "number": "$3.2B",
    "label": "in security deposits wrongfully withheld each year in the US",
    "icon": "dollar"
  },
  ...
]
```

---

## Auth Endpoints

### Check Authentication Status
```
GET /api/auth/check
```
Verifies if the user is authenticated.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "landlord"
  }
}
```

**Response (Not Authenticated):**
```json
{
  "authenticated": false,
  "message": "No auth token found"
}
```

### Login
```
POST /api/auth/login
```
Authenticate user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "landlord"
  },
  "redirectUrl": "/dashboard"
}
```

### Signup
```
POST /api/auth/signup
```
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "plan": "growth"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "new_user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "plan": "growth",
    "role": "landlord"
  },
  "redirectUrl": "/dashboard"
}
```

---

## Dashboard Endpoints

### Get Properties
```
GET /api/dashboard/properties
```
Fetch all properties for the authenticated landlord.

**Response:**
```json
[
  {
    "id": "prop1",
    "address": "123 Main St",
    "city": "Indianapolis",
    "state": "IN",
    "units": [
      {
        "id": "unit1a",
        "name": "1A",
        "tenant": "M. Kowalski",
        "rentAmount": 1800,
        "status": "paid"
      },
      ...
    ]
  },
  ...
]
```

### Create Property
```
POST /api/dashboard/properties
```
Add a new property.

**Request:**
```json
{
  "address": "456 Oak Ave",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78701"
}
```

**Response:**
```json
{
  "success": true,
  "property": {
    "id": "new_prop_id",
    "address": "456 Oak Ave",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "units": []
  }
}
```

### Get Rent Status
```
GET /api/dashboard/rent-status
```
Get current rent collection status for all units.

**Response:**
```json
{
  "month": "April 2026",
  "totalUnits": 6,
  "collectedUnits": 4,
  "percentageCollected": 67,
  "totalRentExpected": 11800,
  "totalRentCollected": 7450,
  "units": [
    {
      "id": "unit1a",
      "unit": "1A",
      "tenant": "M. Kowalski",
      "amount": 1800,
      "status": "paid",
      "paidDate": "2026-03-31"
    },
    ...
  ]
}
```

### Get Maintenance Requests
```
GET /api/dashboard/maintenance
```
Fetch all maintenance requests.

**Response:**
```json
[
  {
    "id": "maint1",
    "unit": "2A",
    "tenant": "R. Nguyen",
    "title": "Leaky faucet in kitchen",
    "description": "...",
    "status": "open",
    "priority": "medium",
    "submittedDate": "2026-04-15"
  },
  ...
]
```

### Create Maintenance Request
```
POST /api/dashboard/maintenance
```
Create a new maintenance request (can be submitted by tenant or landlord).

**Request:**
```json
{
  "unitId": "unit2a",
  "title": "Leaky faucet in kitchen",
  "description": "Kitchen sink is leaking underneath the cabinet",
  "priority": "medium",
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "request": {
    "id": "new_maint_id",
    "unitId": "unit2a",
    "title": "Leaky faucet in kitchen",
    "status": "open",
    "submittedDate": "2026-04-20T10:30:00Z"
  }
}
```

### Get Deposits
```
GET /api/dashboard/deposits
```
Fetch all deposit records.

**Response:**
```json
[
  {
    "id": "dep1",
    "unit": "1A",
    "tenant": "M. Kowalski",
    "amount": 1800,
    "dateReceived": "2025-12-15",
    "moveInDate": "2025-12-15",
    "status": "held"
  },
  ...
]
```

### Create Deposit Record
```
POST /api/dashboard/deposits
```
Record a security deposit.

**Request:**
```json
{
  "unitId": "unit2a",
  "tenantId": "tenant123",
  "amount": 1950,
  "dateReceived": "2026-01-10T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "deposit": {
    "id": "new_dep_id",
    "unitId": "unit2a",
    "amount": 1950,
    "status": "held"
  }
}
```

---

## Tenant Endpoints

### Get Tenant Portal
```
GET /api/tenant/portal
```
Get tenant dashboard data including rent, documents, and maintenance requests.

**Response:**
```json
{
  "tenant": {
    "id": "tenant123",
    "name": "R. Nguyen",
    "email": "r.nguyen@email.com"
  },
  "unit": {
    "id": "unit2a",
    "number": "2A",
    "lease": {
      "rentAmount": 1950,
      "dueDate": 1
    }
  },
  "currentRent": {
    "dueDate": "2026-05-01",
    "amount": 1950,
    "status": "pending"
  },
  "documents": [...],
  "maintenanceRequests": [...]
}
```

### Pay Rent
```
POST /api/tenant/pay-rent
```
Submit rent payment from tenant portal.

**Request:**
```json
{
  "tenantId": "tenant123",
  "unitId": "unit2a",
  "amount": 1950,
  "paymentMethod": "bank"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment123",
    "status": "completed",
    "timestamp": "2026-04-20T10:30:00Z",
    "receiptUrl": "/receipts/payment123.pdf"
  },
  "message": "Payment submitted successfully"
}
```

### Submit Maintenance Request (Tenant)
```
POST /api/tenant/maintenance
```
Tenant submits a maintenance request.

**Request:**
```json
{
  "tenantId": "tenant123",
  "unitId": "unit2a",
  "title": "Leaky faucet in kitchen",
  "description": "Kitchen sink is leaking underneath the cabinet",
  "priority": "medium",
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "request": {
    "id": "maint_req_id",
    "status": "open",
    "submittedDate": "2026-04-20T10:30:00Z"
  },
  "message": "Maintenance request submitted successfully"
}
```

### Get Move-In Walkthrough
```
GET /api/tenant/move-in-walkthrough
```
Get move-in photo walkthrough details and rooms.

**Response:**
```json
{
  "id": "walkthrough123",
  "tenantId": "tenant123",
  "status": "not-started",
  "rooms": [
    {
      "id": "room1",
      "name": "Living Room",
      "status": "pending",
      "photos": []
    },
    ...
  ],
  "instructions": "Take clear photos of the condition of each room..."
}
```

### Submit Move-In Walkthrough Photos
```
POST /api/tenant/move-in-walkthrough
```
Submit timestamped, locked photos for move-in walkthrough.

**Request:**
```json
{
  "tenantId": "tenant123",
  "unitId": "unit2a",
  "roomId": "room1",
  "photos": ["photo1.jpg", "photo2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "room": {
    "id": "room1",
    "photoCount": 2,
    "uploadedDate": "2026-04-20T10:30:00Z",
    "locked": true,
    "certificate": {
      "timestamp": "2026-04-20T10:30:00Z",
      "hash": "sha256hash_placeholder",
      "status": "verified"
    }
  },
  "message": "Room photos submitted and locked successfully"
}
```

---

## Usage Examples

### Using the API from Frontend Components

Import the API utility:
```typescript
import api from '@/lib/api'

// Get pricing data
const pricing = await api.content.getPricing()

// Login user
const loginResult = await api.auth.login('user@example.com', 'password')

// Get dashboard rent status
const rentStatus = await api.dashboard.getRentStatus()

// Tenant pays rent
const payment = await api.tenant.payRent('tenant123', 'unit2a', 1950, 'bank')
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses include an `error` field:
```json
{
  "error": "Email and password are required"
}
```

---

## Authentication

Protected endpoints require an `auth_token` cookie or Authorization header. This should be set after login.

---

## Rate Limiting

Currently no rate limiting. Implement as needed for production.

---

## Next Steps for Implementation

1. **Connect to Database**: Replace mock data with real database queries
2. **Add Firebase Auth**: Integrate Firebase authentication for login/signup
3. **Implement Payment Processing**: Add Stripe or similar for rent payments
4. **Add File Storage**: Implement cloud storage (Firebase Storage, AWS S3) for photos/documents
5. **Add Real-time Updates**: Use WebSockets or Firebase Realtime Database for live updates
6. **Add Email Notifications**: Send emails for rent reminders, payment confirmations, etc.
7. **Add Error Logging**: Implement error tracking (Sentry, etc.)
8. **Add Rate Limiting**: Protect endpoints from abuse
9. **Add Request Validation**: Implement Zod or similar for robust validation
10. **Add Unit Tests**: Test each endpoint thoroughly
