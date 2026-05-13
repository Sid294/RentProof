from fastapi import APIRouter, HTTPException, status
from backend.models import (
    Property, PropertyCreateRequest, RentStatus, RentStatusUnit,
    MaintenanceRequest, MaintenanceCreateRequest, Deposit, DepositCreateRequest,
    Unit, UnitCreateRequest
)
from typing import List
from datetime import datetime
from pathlib import Path
import json

router = APIRouter()

# Mock data storage (replace with real database)
PROPERTIES_DB = []
MAINTENANCE_DB = []
DEPOSITS_DB = []

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / ".data"
PROPERTIES_FILE = DATA_DIR / "properties.json"


def read_properties() -> list[Property]:
    try:
        if not PROPERTIES_FILE.exists():
            return []
        with PROPERTIES_FILE.open("r", encoding="utf-8") as file:
            data = json.load(file)

        def normalize_due_date(value):
            if value is None:
                return None
            if isinstance(value, int):
                return value
            if isinstance(value, str):
                if value.isdigit():
                    return int(value)
                try:
                    return datetime.fromisoformat(value).day
                except ValueError:
                    return None
            return None

        normalized_properties = []
        for item in data:
            units = []
            for unit in item.get("units", []):
                unit["dueDate"] = normalize_due_date(unit.get("dueDate"))
                units.append(unit)
            item["units"] = units
            normalized_properties.append(Property(**item))

        return normalized_properties
    except Exception:
        return []


def write_properties(properties: list[Property]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with PROPERTIES_FILE.open("w", encoding="utf-8") as file:
        json.dump([property_item.model_dump() for property_item in properties], file, indent=2)


# ==================== Properties ====================

@router.get("/properties", response_model=List[Property])
async def get_properties():
    """Get all properties for authenticated user"""
    # TODO: Filter by user ID from auth token
    return read_properties()


@router.post("/properties", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_property(request: PropertyCreateRequest):
    """Create a new property"""
    try:
        properties = read_properties()
        new_property = Property(
            id=f"prop_{datetime.now().timestamp()}",
            address=request.address,
            city=request.city,
            state=request.state,
            zipCode=request.zipCode,
            units=[]
        )

        properties.append(new_property)
        write_properties(properties)
        
        return {
            "success": True,
            "property": new_property.model_dump()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create property"
        )


@router.post("/properties/{property_id}/units", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_property_unit(property_id: str, request: UnitCreateRequest):
    """Add a unit to an existing property"""
    try:
        properties = read_properties()

        for index, property_item in enumerate(properties):
            if property_item.id != property_id:
                continue

            new_unit = Unit(
                id=f"unit_{datetime.now().timestamp()}",
                name=request.name,
                tenant=request.tenant or "",
                rentAmount=request.rentAmount,
                status=request.status,
                dueDate=str(request.dueDate) if request.dueDate is not None else None,
            )

            updated_property = Property(
                id=property_item.id,
                address=property_item.address,
                city=property_item.city,
                state=property_item.state,
                zipCode=property_item.zipCode,
                units=[*property_item.units, new_unit],
            )

            properties[index] = updated_property
            write_properties(properties)

            return {
                "success": True,
                "property": updated_property.model_dump(),
                "unit": new_unit.model_dump(),
            }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create unit"
        )


# ==================== Rent Status ====================

@router.get("/rent-status", response_model=RentStatus)
async def get_rent_status():
    """Get current rent collection status"""
    # TODO: Fetch from database filtered by user properties
    from datetime import datetime as dt
    current_month = dt.now().strftime("%B %Y")
    return RentStatus(
        month=current_month,
        totalUnits=0,
        collectedUnits=0,
        percentageCollected=0,
        totalRentExpected=0,
        totalRentCollected=0,
        units=[]
    )


# ==================== Maintenance ====================

@router.get("/maintenance", response_model=List[MaintenanceRequest])
async def get_maintenance():
    """Get all maintenance requests"""
    # TODO: Fetch from database filtered by user
    # Start with empty list - tenants submit maintenance requests
    return []


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
    # Start with empty list - landlord records deposits
    return []


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
