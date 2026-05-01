from fastapi import APIRouter, HTTPException, status
from models import (
    TenantPortal, PaymentRequest, PaymentResponse, Payment,
    TenantMaintenanceRequest, MoveInWalkthrough, WalkthroughRoom,
    WalkthroughSubmitRequest, WalkthroughSubmitResponse, Certificate
)
from datetime import datetime
import hashlib

router = APIRouter()

# Mock data storage
PAYMENTS_DB = []
WALKTHROUGH_DB = []


# ==================== Tenant Portal ====================

@router.get("/portal", response_model=dict)
async def get_tenant_portal():
    """Get tenant dashboard data"""
    # TODO: Fetch from database filtered by tenant ID
    return {
        "tenant": {
            "id": "tenant123",
            "name": "R. Nguyen",
            "email": "r.nguyen@email.com",
            "role": "tenant",
        },
        "property": {
            "id": "prop1",
            "address": "123 Main St, Indianapolis, IN",
        },
        "unit": {
            "id": "unit2a",
            "number": "2A",
            "lease": {
                "id": "lease1",
                "startDate": "2026-01-10",
                "endDate": "2027-01-09",
                "rentAmount": 1950,
                "dueDate": 1,
            },
        },
        "currentRent": {
            "dueDate": "2026-05-01",
            "amount": 1950,
            "status": "pending",
            "paymentMethods": [
                {"id": "bank", "name": "Bank Transfer", "enabled": True},
                {"id": "card", "name": "Credit/Debit Card", "enabled": True},
            ],
        },
        "documents": [
            {
                "id": "doc1",
                "name": "Lease Agreement",
                "type": "lease",
                "uploadedDate": "2026-01-10",
            },
            {
                "id": "doc2",
                "name": "Move-in Photos",
                "type": "photo-walkthrough",
                "uploadedDate": "2026-01-10",
            },
        ],
        "maintenanceRequests": [
            {
                "id": "maint1",
                "title": "Leaky faucet in kitchen",
                "status": "open",
                "submittedDate": "2026-04-15",
                "priority": "medium",
            },
        ],
    }


# ==================== Rent Payment ====================

@router.post("/pay-rent", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
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
        
        # TODO: Process payment through Stripe or payment processor
        payment = Payment(
            id=f"payment_{datetime.now().timestamp()}",
            tenantId=request.tenantId,
            unitId=request.unitId,
            amount=request.amount,
            paymentMethod=request.paymentMethod,
            status="completed",
            timestamp=datetime.now().isoformat(),
            receiptUrl=f"/receipts/payment_{datetime.now().timestamp()}.pdf"
        )
        
        PAYMENTS_DB.append(payment)
        
        # TODO: Send confirmation email to tenant and landlord
        
        return PaymentResponse(
            success=True,
            payment=payment,
            message="Payment submitted successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Payment processing failed"
        )


# ==================== Maintenance Requests ====================

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
        
        # TODO: Store in database and notify landlord
        
        return {
            "success": True,
            "request": maintenance,
            "message": "Maintenance request submitted successfully"
        }
    
    except HTTPException:
        raise
    except Exception as e:
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
