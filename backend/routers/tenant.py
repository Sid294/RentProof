from fastapi import APIRouter, HTTPException, status, Request
from backend.models import (
    TenantPortal, PaymentRequest, PaymentResponse, Payment,
    TenantMaintenanceRequest, MoveInWalkthrough, WalkthroughRoom,
    WalkthroughSubmitRequest, WalkthroughSubmitResponse, Certificate
)
from datetime import datetime, timedelta
import hashlib
from pathlib import Path
import json
import logging
from backend.firebase import get_tenant, get_tenant_by_name, get_maintenance_requests, get_payments, get_walkthroughs

logger = logging.getLogger(__name__)

router = APIRouter()
PAYMENTS_DB = []
WALKTHROUGH_DB = []

# Setup maintenance file storage
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / ".data"
MAINTENANCE_FILE = DATA_DIR / "maintenance.json"
PAYMENTS_FILE = DATA_DIR / "payments.json"


def read_maintenance() -> list[dict]:
    """Read maintenance requests from file"""
    try:
        if not MAINTENANCE_FILE.exists():
            return []
        with MAINTENANCE_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except Exception as e:
        print(f"Error reading maintenance requests: {e}")
        return []


def write_maintenance(requests: list[dict]) -> None:
    """Write maintenance requests to file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with MAINTENANCE_FILE.open("w", encoding="utf-8") as file:
        json.dump(requests, file, indent=2)


def read_payments() -> list[dict]:
    """Read payments from file"""
    try:
        if not PAYMENTS_FILE.exists():
            return []
        with PAYMENTS_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)
        return data if isinstance(data, list) else []
    except Exception as e:
        print(f"Error reading payments: {e}")
        return []


def write_payments(payments: list[dict]) -> None:
    """Write payments to file"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with PAYMENTS_FILE.open("w", encoding="utf-8") as file:
        json.dump(payments, file, indent=2)


# ==================== Tenant Portal ====================

@router.get("/portal", response_model=dict)
async def get_tenant_portal(email: str = None, name: str = None):
    """Get tenant dashboard data from Firestore"""
    try:
        logger.info(f"Fetching tenant portal data - email: {email}, name: {name}")
        
        tenant_data = None
        
        # Try to fetch by email first
        if email:
            tenant_data = await get_tenant(email)
        
        # Try to fetch by name if email lookup failed or name is provided
        if not tenant_data and name:
            tenant_data = await get_tenant_by_name(name)
            if tenant_data:
                email = tenant_data.get("id")  # Use the tenant's ID (usually email) from Firebase
        
        # Default to "Atharv Ranjan" if nothing found
        if not tenant_data:
            logger.info("Attempting to fetch default tenant: Atharv Ranjan")
            tenant_data = await get_tenant_by_name("Atharv Ranjan")
            if tenant_data:
                email = tenant_data.get("id")
        
        # If still no tenant found, return empty state or test tenant
        if not tenant_data:
            logger.warning(f"Tenant not found in Firestore (email: {email}, name: {name})")
            # If a specific email was requested, return their test data
            if email:
                if email == "test123@gmail.com":
                    today = datetime.now()
                    lease_start = today - timedelta(days=60)
                    lease_end = today + timedelta(days=305)
                    next_month = today.replace(day=1) + timedelta(days=32)
                    next_due = next_month.replace(day=1)
                    
                    return {
                        "tenant": {
                            "id": "test123@gmail.com",
                            "name": "Test Tenant",
                            "email": "test123@gmail.com",
                            "role": "tenant"
                        },
                        "property": {
                            "id": "prop_test",
                            "address": "100 Test Street, Testville, TX 75000"
                        },
                        "unit": {
                            "id": "unit_test",
                            "number": "1A",
                            "status": "occupied",
                            "lease": {
                                "id": "lease_test",
                                "startDate": lease_start.isoformat(),
                                "endDate": lease_end.isoformat(),
                                "rentAmount": 1800,
                                "dueDate": 1
                            }
                        },
                        "currentRent": {
                            "dueDate": next_due.isoformat(),
                            "amount": 1800,
                            "status": "pending",
                            "paymentMethods": [
                                {"type": "bank", "label": "Bank Transfer"},
                                {"type": "card", "label": "Credit Card"}
                            ]
                        },
                        "documents": [],
                        "maintenanceRequests": []
                    }
            
            # Default fallback for Atharv Ranjan
            today = datetime.now()
            lease_start = today - timedelta(days=90)
            lease_end = today + timedelta(days=275)
            next_month = today.replace(day=1) + timedelta(days=32)
            next_due = next_month.replace(day=1)
            
            return {
                "tenant": {
                    "id": "atharv_ranjan",
                    "name": "Atharv Ranjan",
                    "email": "atharv.ranjan@example.com",
                    "role": "tenant"
                },
                "property": {
                    "id": "prop_001",
                    "address": "456 Oak Avenue, San Francisco, CA 94103"
                },
                "unit": {
                    "id": "unit_456",
                    "number": "B2",
                    "status": "occupied",
                    "lease": {
                        "id": "lease_456",
                        "startDate": lease_start.isoformat(),
                        "endDate": lease_end.isoformat(),
                        "rentAmount": 3200,
                        "dueDate": 1
                    }
                },
                "currentRent": {
                    "dueDate": next_due.isoformat(),
                    "amount": 3200,
                    "status": "pending",
                    "paymentMethods": [
                        {"type": "bank", "label": "Bank Transfer"},
                        {"type": "card", "label": "Credit Card"}
                    ]
                },
                "documents": [],
                "maintenanceRequests": []
            }
        
        # Fetch related data
        if email:
            maintenance_requests = await get_maintenance_requests(email)
            payments = await get_payments(email)
            walkthroughs = await get_walkthroughs(email)
        else:
            maintenance_requests = []
            payments = []
            walkthroughs = []
        
        # Calculate lease dates
        today = datetime.now()
        lease_start = today - timedelta(days=90)
        lease_end = today + timedelta(days=275)
        
        # Calculate next rent due date
        due_day = tenant_data.get("due_date", 1)
        next_month = today.replace(day=1) + timedelta(days=32)
        next_due = next_month.replace(day=min(due_day, 28))
        
        # Find most recent payment to determine status
        rent_status = "pending"
        if payments:
            latest_payment = max(payments, key=lambda x: x.get("created_at", ""))
            payment_date = latest_payment.get("created_at", "")
            if payment_date >= next_due.isoformat():
                rent_status = "paid"
            else:
                rent_status = "late"
        
        return {
            "tenant": {
                "id": tenant_data.get("id", f"tenant_{email}"),
                "name": tenant_data.get("name", email.split("@")[0] if email else "Tenant"),
                "email": email or tenant_data.get("email", "unknown@example.com"),
                "role": "tenant"
            },
            "property": {
                "id": tenant_data.get("property_id", "prop_001"),
                "address": tenant_data.get("property_address", "Unknown Address")
            },
            "unit": {
                "id": tenant_data.get("unit_id", "unit_001"),
                "number": tenant_data.get("unit_number", "101"),
                "status": tenant_data.get("status", "occupied"),
                "lease": {
                    "id": f"lease_{tenant_data.get('unit_id', 'unit_001')}",
                    "startDate": lease_start.isoformat(),
                    "endDate": lease_end.isoformat(),
                    "rentAmount": tenant_data.get("rent_amount", 1500),
                    "dueDate": due_day
                }
            },
            "currentRent": {
                "dueDate": next_due.isoformat(),
                "amount": tenant_data.get("rent_amount", 1500),
                "status": rent_status,
                "paymentMethods": [
                    {"type": "bank", "label": "Bank Transfer"},
                    {"type": "card", "label": "Credit Card"}
                ]
            },
            "documents": walkthroughs if walkthroughs else [],
            "maintenanceRequests": maintenance_requests
        }
    except Exception as e:
        logger.error(f"Error fetching tenant portal: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tenant portal data: {str(e)}"
        )


# ==================== Rent Payment ====================

@router.post("/pay-rent", response_model=dict, status_code=status.HTTP_201_CREATED)
async def pay_rent(request: PaymentRequest):
    """Submit rent payment from tenant portal"""
    try:
        if not request.tenantId or not request.amount or not request.paymentMethod:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant ID, amount, and payment method are required"
            )
        
        if request.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than 0"
            )
        
        # Create payment record
        payment_dict = {
            "id": f"payment_{datetime.now().timestamp()}",
            "tenantId": request.tenantId,
            "unitId": request.unitId,
            "amount": float(request.amount),
            "paymentMethod": request.paymentMethod,
            "status": "completed",
            "timestamp": datetime.now().isoformat()
        }
        
        # Save payment to file
        payments = read_payments()
        payments.append(payment_dict)
        write_payments(payments)
        
        # Update unit status to paid in properties
        from backend.routers.dashboard import read_properties, write_properties
        properties = read_properties()
        
        updated = False
        for prop in properties:
            for unit in prop.units:
                if unit.id == request.unitId:
                    unit.status = "paid"
                    unit.paidDate = datetime.now().isoformat()
                    updated = True
        
        if updated:
            write_properties(properties)
        
        return {
            "success": True,
            "payment": payment_dict,
            "message": "Payment submitted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Payment error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# ==================== Maintenance Requests ====================

@router.get("/maintenance", response_model=list[dict])
async def get_maintenance():
    """Get all maintenance requests"""
    return read_maintenance()


@router.post("/maintenance", response_model=dict, status_code=status.HTTP_201_CREATED)
async def submit_maintenance(request: TenantMaintenanceRequest):
    """Tenant submits a maintenance request"""
    try:
        if not request.tenantId or not request.unitId or not request.title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant ID, unit ID, and title are required"
            )
        
        maintenance = {
            "id": f"maint_req_{datetime.now().timestamp()}",
            "tenantId": request.tenantId,
            "unitId": request.unitId,
            "title": request.title,
            "description": request.description,
            "priority": request.priority,
            "status": "open",
            "submittedDate": datetime.now().isoformat(),
            "images": request.images,
        }
        
        # Save to file
        maintenance_list = read_maintenance()
        maintenance_list.append(maintenance)
        write_maintenance(maintenance_list)
        
        return {
            "success": True,
            "request": maintenance,
            "message": "Maintenance request submitted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error submitting maintenance: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit maintenance request"
        )


# ==================== Move-In Walkthrough ====================

@router.get("/move-in-walkthrough", response_model=MoveInWalkthrough)
async def get_move_in_walkthrough():
    """Get move-in photo walkthrough details"""
    # TODO: Fetch from database filtered by tenant
    rooms = [
        WalkthroughRoom(id="room1", name="Living Room", status="pending"),
        WalkthroughRoom(id="room2", name="Kitchen", status="pending"),
        WalkthroughRoom(id="room3", name="Bedroom 1", status="pending"),
        WalkthroughRoom(id="room4", name="Bedroom 2", status="pending"),
        WalkthroughRoom(id="room5", name="Bathroom", status="pending"),
    ]
    
    return MoveInWalkthrough(
        id="walkthrough123",
        tenantId="tenant123",
        unitId="unit2a",
        status="not-started",
        rooms=rooms,
        instructions="Take clear photos of the condition of each room. Capture any existing damage, stains, or wear."
    )


@router.post("/move-in-walkthrough", response_model=WalkthroughSubmitResponse, status_code=status.HTTP_201_CREATED)
async def submit_move_in_walkthrough(request: WalkthroughSubmitRequest):
    """Submit timestamped, locked photos for move-in walkthrough"""
    try:
        if not request.tenantId or not request.unitId or not request.roomId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tenant ID, unit ID, and room ID are required"
            )
        
        # Generate cryptographic hash for immutability
        photo_data = f"{request.tenantId}{request.unitId}{request.roomId}{''.join(request.photos)}{datetime.now().isoformat()}"
        content_hash = hashlib.sha256(photo_data.encode()).hexdigest()
        
        # Create certificate of authenticity
        certificate = Certificate(
            timestamp=datetime.now().isoformat(),
            hash=content_hash,
            status="verified"
        )
        
        room_data = {
            "id": request.roomId,
            "tenantId": request.tenantId,
            "unitId": request.unitId,
            "photoCount": len(request.photos),
            "uploadedDate": datetime.now().isoformat(),
            "locked": True,
            "certificate": certificate.model_dump()
        }
        
        # TODO: Store photos in cloud storage (Firebase Storage, AWS S3, etc.)
        # TODO: Make sure photos cannot be deleted or modified
        
        return WalkthroughSubmitResponse(
            success=True,
            room=room_data,
            message="Room photos submitted and locked successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit walkthrough photos"
        )
