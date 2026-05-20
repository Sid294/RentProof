#!/usr/bin/env python3
"""
List all tenants from Firebase Firestore
"""
import sys
sys.path.insert(0, '/Users/lakshminarayanans/MedoHack/RentProof')

from backend.firebase import get_db
import json

def list_tenants():
    """List all tenants in Firestore"""
    try:
        db = get_db()
        tenants = db.collection("tenants").stream()
        
        tenant_list = []
        for doc in tenants:
            data = doc.to_dict()
            tenant_list.append({
                "email": doc.id,
                "name": data.get("name", "Unknown"),
                "address": data.get("property_address", "N/A"),
                "unit": data.get("unit_number", "N/A"),
                "rent": data.get("rent_amount", "N/A")
            })
        
        print(json.dumps(tenant_list, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    list_tenants()
