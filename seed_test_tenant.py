#!/usr/bin/env python3
"""
Seed test123@gmail.com tenant data in Firebase Firestore
"""
import sys
sys.path.insert(0, '/Users/lakshminarayanans/MedoHack/RentProof')

from backend.firebase import save_tenant
import asyncio
from datetime import datetime, timedelta

async def seed_test_tenant():
    """Create test tenant record in Firebase"""
    test_tenant_data = {
        "id": "test123@gmail.com",
        "name": "Test Tenant",
        "email": "test123@gmail.com",
        "role": "tenant",
        "property_id": "prop_test",
        "property_address": "100 Test Street, Testville, TX 75000",
        "unit_id": "unit_test",
        "unit_number": "1A",
        "rent_amount": 1800,
        "due_date": 1,
        "status": "occupied",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    result = await save_tenant("test123@gmail.com", test_tenant_data)
    if result:
        print("✓ Test tenant seeded successfully in Firebase!")
    else:
        print("✗ Failed to seed test tenant in Firebase")
    
    return result

if __name__ == "__main__":
    asyncio.run(seed_test_tenant())
