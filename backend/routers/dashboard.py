from fastapi import APIRouter, HTTPException, status
from backend.models import (
    Property, PropertyCreateRequest, RentStatus, RentStatusUnit,
    MaintenanceRequest, MaintenanceCreateRequest, Deposit, DepositCreateRequest
)
from typing import List
from datetime import datetime

router = APIRouter()

# Mock data storage (replace with real database)
PROPERTIES_DB = []
MAINTENANCE_DB = []
DEPOSITS_DB = []


# ==================== Properties ====================

@router.get("/properties", response_model=List[Property])
async def get_properties():
    """Get all properties for authenticated user"""
    # TODO: Filter by user ID from auth token
    # Mock data
    return [
        Property(
            id="prop1",
            address="123 Main St",
            city="Indianapolis",
            state="IN",
            units=[
                {
                    "id": "unit1a",
                    "name": "1A",
                    "tenant": "M. Kowalski",
                    "rentAmount": 1800,
                    "status": "paid",
                    "dueDate": "2026-04-01",
                },
                {
                    "id": "unit1b",
                    "name": "1B",
                    "tenant": "T. Okonkwo",
                    "rentAmount": 2100,
                    "status": "paid",
                    "dueDate": "2026-04-01",
                },
            ]
        )
    ]


@router.post("/properties", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_property(request: PropertyCreateRequest):
    """Create a new property"""
    try:
        # TODO: Validate and store in database
        new_property = Property(
            id=f"prop_{datetime.now().timestamp()}",
            address=request.address,
            city=request.city,
            state=request.state,
            zipCode=request.zipCode,
            units=[]
        )
        
        PROPERTIES_DB.append(new_property)
        
        return {
            "success": True,
            "property": new_property.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create property"
        )


# ==================== Rent Status ====================

@router.get("/rent-status", response_model=RentStatus)
async def get_rent_status():
    """Get current rent collection status"""
    # TODO: Fetch from database filtered by user properties
    return RentStatus(
        month="April 2026",
        totalUnits=6,
        collectedUnits=4,
        percentageCollected=67,
        totalRentExpected=11800,
        totalRentCollected=7450,
        units=[
            RentStatusUnit(
                id="unit1a",
                unit="1A",
                tenant="M. Kowalski",
                amount=1800,
                status="paid",
                paidDate="2026-03-31",
            ),
            RentStatusUnit(
                id="unit1b",
                unit="1B",
                tenant="T. Okonkwo",
                amount=2100,
                status="paid",
                paidDate="2026-04-01",
            ),
            RentStatusUnit(
                id="unit2a",
                unit="2A",
                tenant="R. Nguyen",
                amount=1950,
                status="pending",
                dueDate="2026-04-01",
            ),
            RentStatusUnit(
                id="unit2b",
                unit="2B",
                tenant="S. Martinez",
                amount=1650,
                status="paid",
                paidDate="2026-04-02",
            ),
            RentStatusUnit(
                id="unit3a",
                unit="3A",
                tenant="J. Patel",
                amount=2400,
                status="late",
                daysLate=3,
                dueDate="2026-03-30",
            ),
            RentStatusUnit(
                id="unit3b",
                unit="3B",
                tenant="C. Williams",
                amount=1900,
                status="paid",
                paidDate="2026-03-31",
            ),
        ]
    )


# ==================== Maintenance ====================

@router.get("/maintenance", response_model=List[MaintenanceRequest])
async def get_maintenance():
    """Get all maintenance requests"""
    # TODO: Fetch from database filtered by user
    return [
        MaintenanceRequest(
            id="maint1",
            unit="2A",
            tenant="R. Nguyen",
            title="Leaky faucet in kitchen",
            description="Kitchen sink is leaking underneath the cabinet",
            status="open",
            priority="medium",
            submittedDate="2026-04-15",
            images=["image1.jpg", "image2.jpg"],
        ),
        MaintenanceRequest(
            id="maint2",
            unit="3A",
            tenant="J. Patel",
            title="HVAC not working",
            description="Air conditioning is not turning on",
            status="in-progress",
            priority="high",
            submittedDate="2026-04-10",
            assignedTo="John Smith",
        ),
        MaintenanceRequest(
            id="maint3",
            unit="1B",
            tenant="T. Okonkwo",
            title="Door lock needs repair",
            description="Front door lock is sticking",
            status="completed",
            priority="low",
            submittedDate="2026-04-05",
            completedDate="2026-04-12",
        ),
    ]


@router.post("/maintenance", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_maintenance(request: MaintenanceCreateRequest):
    """Create a new maintenance request"""
    try:
        if not request.unitId or not request.title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unit ID and title are required"
            )
        
        maintenance = MaintenanceRequest(
            id=f"maint_{datetime.now().timestamp()}",
            unit=request.unitId,
            tenant="",  # TODO: Get tenant from database
            title=request.title,
            description=request.description,
            status="open",
            priority=request.priority,
            submittedDate=datetime.now().isoformat(),
            images=request.images,
        )
        
        MAINTENANCE_DB.append(maintenance)
        
        return {
            "success": True,
            "request": maintenance.model_dump()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create maintenance request"
        )


# ==================== Deposits ====================

@router.get("/deposits", response_model=List[Deposit])
async def get_deposits():
    """Get all deposit records"""
    # TODO: Fetch from database filtered by user
    return [
        Deposit(
            id="dep1",
            unit="1A",
            tenant="M. Kowalski",
            amount=1800,
            dateReceived="2025-12-15",
            moveInDate="2025-12-15",
            status="held",
        ),
        Deposit(
            id="dep2",
            unit="1B",
            tenant="T. Okonkwo",
            amount=2100,
            dateReceived="2025-11-01",
            moveInDate="2025-11-01",
            moveOutDate="2026-02-28",
            status="returned",
            returnDeadline="2026-03-30",
            returnedDate="2026-03-25",
            returnAmount=2100,
        ),
        Deposit(
            id="dep3",
            unit="2A",
            tenant="R. Nguyen",
            amount=1950,
            dateReceived="2026-01-10",
            moveInDate="2026-01-10",
            status="held",
        ),
    ]


@router.post("/deposits", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_deposit(request: DepositCreateRequest):
    """Record a security deposit"""
    try:
        if not request.unitId or not request.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unit ID and amount are required"
            )
        
        deposit = Deposit(
            id=f"dep_{datetime.now().timestamp()}",
            unit=request.unitId,
            tenant="",  # TODO: Get tenant from database
            amount=request.amount,
            dateReceived=request.dateReceived,
            moveInDate=request.dateReceived,
            status="held",
        )
        
        DEPOSITS_DB.append(deposit)
        
        return {
            "success": True,
            "deposit": deposit.model_dump()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create deposit"
        )
