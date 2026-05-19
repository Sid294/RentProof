# Firebase Firestore Integration Setup

## Overview
The RentProof tenant portal now saves all tenant data to Firebase Firestore for persistent storage.

## What Gets Saved

### Tenants Collection (`/tenants/{email}`)
When a tenant signs up, their profile is saved:
- `id`: Unique tenant identifier
- `email`: Tenant email (document ID)
- `name`: Tenant full name
- `role`: Always "tenant"
- `plan`: Subscription plan
- `property_address`: The rental property address
- `property_id`: Associated property ID
- `unit_id`: Associated unit ID
- `unit_number`: Unit number (e.g., "101", "2B")
- `rent_amount`: Monthly rent amount
- `due_date`: Day of month rent is due (e.g., 1, 15)
- `status`: Occupancy status (occupied, vacant)
- `created_at`: ISO timestamp
- `updated_at`: ISO timestamp

### Sub-collections under each tenant:
- `/tenants/{email}/maintenance_requests`: Maintenance requests submitted by tenant
- `/tenants/{email}/payments`: Rent payments made by tenant
- `/tenants/{email}/walkthroughs`: Move-in walkthrough documentation

## Firestore Rules
Recommended security rules for Firestore (set in Firebase Console):

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Tenants can only read/write their own document
    match /tenants/{email} {
      allow read, write: if request.auth.token.email == email;
      
      // Sub-collections follow same rule
      match /{document=**} {
        allow read, write: if request.auth.token.email == email;
      }
    }
  }
}
```

## Setup Steps

### 1. Get Firebase Service Account Credentials

1. Go to: https://console.firebase.google.com/project/rentroof-bcfaf/settings/serviceaccounts/adminsdk
2. Click "Generate New Private Key"
3. Save the JSON file securely

### 2. Configure Backend Authentication

Choose ONE option:

**Option A: Use gcloud CLI (Recommended for local development)**
```bash
# Install gcloud SDK
# https://cloud.google.com/sdk/docs/install

# Login to Firebase
gcloud auth application-default login

# Select your Firebase project when prompted
```

**Option B: Use Service Account JSON (for production/CI/CD)**
```bash
# Set environment variable with your service account JSON:
export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'

# Or add to .env.backend file:
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

### 3. Test the Integration

1. Sign up a new tenant in the portal
2. Check Firebase Console → Firestore → tenants collection
3. You should see the new tenant document with their email as the ID

## API Endpoints

### Get Tenant Portal Data
```bash
curl "http://localhost:8001/api/tenant/portal?email=user@example.com"
```

**Parameters:**
- `email`: The tenant's email address

**Response:**
```json
{
  "tenant": {
    "id": "user_tenant_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  },
  "property": {
    "id": "prop_001",
    "address": "123 Main St"
  },
  "unit": {
    "id": "unit_001",
    "number": "101",
    "lease": {
      "rentAmount": 1500,
      "dueDate": 1
    }
  },
  "currentRent": {
    "dueDate": "2026-06-01T00:00:00",
    "amount": 1500,
    "status": "pending"
  },
  "documents": [],
  "maintenanceRequests": []
}
```

## Frontend Integration

Update `lib/api.ts` to pass the current user's email:

```typescript
tenant: {
  getPortal: async () => {
    const user = auth.currentUser;
    const email = user?.email || '';
    const res = await fetch(`${API_BASE}/tenant/portal?email=${encodeURIComponent(email)}`)
    if (!res.ok) throw new Error('Failed to fetch tenant portal')
    return res.json()
  },
  ...
}
```

## Firestore Limitations & Next Steps

1. **Authentication**: Currently uses email parameter. Should be updated to use Firebase ID tokens
2. **Authorization**: Frontend needs to pass auth token for security
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Backup**: Enable automatic backups in Firebase Console
5. **Indexing**: Create composite indexes for complex queries

## Troubleshooting

### "Firebase app not initialized"
- Make sure `firebase-admin` is installed: `pip install firebase-admin`
- Check that credentials are properly configured

### "Permission denied" error
- Verify Firestore security rules allow read/write
- Check that you're logged in with gcloud: `gcloud auth list`

### "Document not found"
- Tenant hasn't been created yet, need to sign up first
- Check email parameter matches exactly

## References
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
