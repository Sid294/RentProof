"""
Firebase Firestore service for tenant data storage
"""
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any, Optional, List
import os
import json
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
def init_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
        logger.info("Firebase app already initialized")
        return
    except ValueError:
        # App not initialized, initialize it
        try:
            # Try to get credentials from environment variable
            creds_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
            if creds_json:
                creds_dict = json.loads(creds_json)
                creds = credentials.Certificate(creds_dict)
                firebase_admin.initialize_app(creds)
                logger.info("Firebase initialized with service account JSON")
            else:
                # Try to use default credentials
                firebase_admin.initialize_app()
                logger.info("Firebase initialized with default credentials")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            raise

def get_db():
    """Get Firestore database client"""
    init_firebase()
    return firestore.client()

# Tenant operations
async def save_tenant(email: str, tenant_data: Dict[str, Any]) -> bool:
    """Save tenant to Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(email).set(tenant_data, merge=True)
        logger.info(f"Tenant {email} saved to Firestore")
        return True
    except Exception as e:
        logger.error(f"Failed to save tenant {email}: {str(e)}")
        return False

async def get_tenant(email: str) -> Optional[Dict[str, Any]]:
    """Get tenant from Firestore"""
    try:
        db = get_db()
        doc = db.collection("tenants").document(email).get()
        if doc.exists:
            data = doc.to_dict()
            data["id"] = doc.id
            logger.info(f"Tenant {email} retrieved from Firestore")
            return data
        logger.warning(f"Tenant {email} not found in Firestore")
        return None
    except Exception as e:
        logger.error(f"Failed to get tenant {email}: {str(e)}")
        # Fallback to local .data/tenants.json for development
        try:
            from pathlib import Path
            base = Path(__file__).resolve().parents[1]
            local_file = base / '.data' / 'tenants.json'
            if not local_file.exists():
                # also try repo root .data
                local_file = base.parent / '.data' / 'tenants.json'
            if local_file.exists():
                with open(local_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                tenant = data.get(email)
                if tenant:
                    logger.info(f"Tenant {email} loaded from local data")
                    return tenant
        except Exception as e2:
            logger.error(f"Failed to read local tenants.json: {str(e2)}")
        return None

async def update_tenant(email: str, updates: Dict[str, Any]) -> bool:
    """Update tenant in Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(email).update(updates)
        logger.info(f"Tenant {email} updated in Firestore")
        return True
    except Exception as e:
        logger.error(f"Failed to update tenant {email}: {str(e)}")
        return False

async def delete_tenant(email: str) -> bool:
    """Delete tenant from Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(email).delete()
        logger.info(f"Tenant {email} deleted from Firestore")
        return True
    except Exception as e:
        logger.error(f"Failed to delete tenant {email}: {str(e)}")
        return False

# Maintenance request operations
async def save_maintenance_request(tenant_email: str, request_data: Dict[str, Any]) -> bool:
    """Save maintenance request to Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(tenant_email).collection("maintenance_requests").add(request_data)
        logger.info(f"Maintenance request saved for tenant {tenant_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to save maintenance request for {tenant_email}: {str(e)}")
        return False

async def get_maintenance_requests(tenant_email: str) -> List[Dict[str, Any]]:
    """Get all maintenance requests for a tenant"""
    try:
        db = get_db()
        docs = db.collection("tenants").document(tenant_email).collection("maintenance_requests").stream()
        requests = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            requests.append(data)
        logger.info(f"Retrieved {len(requests)} maintenance requests for {tenant_email}")
        return requests
    except Exception as e:
        logger.error(f"Failed to get maintenance requests for {tenant_email}: {str(e)}")
        return []

# Payment operations
async def save_payment(tenant_email: str, payment_data: Dict[str, Any]) -> bool:
    """Save payment to Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(tenant_email).collection("payments").add(payment_data)
        logger.info(f"Payment saved for tenant {tenant_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to save payment for {tenant_email}: {str(e)}")
        return False

async def get_payments(tenant_email: str) -> List[Dict[str, Any]]:
    """Get all payments for a tenant"""
    try:
        db = get_db()
        docs = db.collection("tenants").document(tenant_email).collection("payments").stream()
        payments = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            payments.append(data)
        logger.info(f"Retrieved {len(payments)} payments for {tenant_email}")
        return payments
    except Exception as e:
        logger.error(f"Failed to get payments for {tenant_email}: {str(e)}")
        return []

async def get_tenant_by_name(name: str) -> Optional[Dict[str, Any]]:
    """Search for tenant by name in Firestore"""
    try:
        db = get_db()
        # Query for tenants with matching name
        query = db.collection("tenants").where("name", "==", name).limit(1)
        docs = query.stream()
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            logger.info(f"Tenant {name} retrieved from Firestore")
            return data
        logger.warning(f"Tenant {name} not found in Firestore")
        return None
    except Exception as e:
        logger.error(f"Failed to get tenant {name}: {str(e)}")
        # Fallback to local tenants.json
        try:
            from pathlib import Path
            base = Path(__file__).resolve().parents[1]
            local_file = base / '.data' / 'tenants.json'
            if not local_file.exists():
                local_file = base.parent / '.data' / 'tenants.json'
            if local_file.exists():
                with open(local_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                # search by name value
                for k, v in data.items():
                    if v.get('name') == name:
                        v['id'] = k
                        logger.info(f"Tenant {name} loaded from local data")
                        return v
        except Exception as e2:
            logger.error(f"Failed to read local tenants.json: {str(e2)}")
        return None

# Walkthrough operations
async def save_walkthrough(tenant_email: str, walkthrough_data: Dict[str, Any]) -> bool:
    """Save move-in walkthrough to Firestore"""
    try:
        db = get_db()
        db.collection("tenants").document(tenant_email).collection("walkthroughs").add(walkthrough_data)
        logger.info(f"Walkthrough saved for tenant {tenant_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to save walkthrough for {tenant_email}: {str(e)}")
        return False

async def get_walkthroughs(tenant_email: str) -> List[Dict[str, Any]]:
    """Get all walkthroughs for a tenant"""
    try:
        db = get_db()
        docs = db.collection("tenants").document(tenant_email).collection("walkthroughs").stream()
        walkthroughs = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            walkthroughs.append(data)
        logger.info(f"Retrieved {len(walkthroughs)} walkthroughs for {tenant_email}")
        return walkthroughs
    except Exception as e:
        logger.error(f"Failed to get walkthroughs for {tenant_email}: {str(e)}")
        return []
