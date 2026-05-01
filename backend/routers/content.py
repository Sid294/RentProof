from fastapi import APIRouter
from models import Feature, PricingPlan, Testimonial, Stat
from typing import List

router = APIRouter()


# ==================== Mock Data ====================

FEATURES: List[Feature] = [
    Feature(
        id="rent-tracking",
        tag="Rent tracking",
        title="Payment status at a glance",
        description="See every unit's payment status in real time. Paid, late, partial -- all on one screen. No calls, no spreadsheet updates, no guessing.",
        icon="chart-dots",
    ),
    Feature(
        id="move-in-docs",
        tag="Move-in documentation",
        title="Timestamped, locked, permanent",
        description="Tenants complete a guided photo walkthrough on day one. Every image is timestamped and locked -- it cannot be edited or deleted by anyone.",
        icon="calendar",
    ),
    Feature(
        id="maintenance",
        tag="Maintenance management",
        title="Submitted, tracked, resolved",
        description="Tenants submit maintenance requests with photos directly in the app. You assign, update, and close them. Every action is logged with a timestamp.",
        icon="wrench",
    ),
    Feature(
        id="deposit-vault",
        tag="Deposit vault",
        title="Protected from the day they move in",
        description="Track deposit amounts and legal return deadlines for every unit. One click generates a complete dispute evidence package if it ever goes to court.",
        icon="lock",
    ),
    Feature(
        id="document-storage",
        tag="Lease and document storage",
        title="Every document in one place",
        description="Upload leases, notices, addendums, and signed agreements. Both parties always have access. Nothing gets lost in an email thread.",
        icon="file",
    ),
    Feature(
        id="messaging",
        tag="In-app messaging",
        title="Every conversation on record",
        description="Every landlord-tenant exchange is timestamped, logged, and stored. No more lost texts. No more 'you never told me.' The record speaks for itself.",
        icon="message",
    ),
]

PRICING_PLANS: List[PricingPlan] = [
    PricingPlan(
        id="starter",
        name="Starter",
        monthlyPrice=19,
        annualPrice=228,
        unitLimit=5,
        description="Perfect for individual landlords",
        features=[
            "Rent tracking and payment status",
            "Automated rent reminders",
            "Maintenance request management",
            "Move-in photo documentation",
            "Lease and document storage",
            "Tenant portal (unlimited tenants)",
        ],
        cta="Start Free Trial",
        link="/signup?plan=starter",
    ),
    PricingPlan(
        id="growth",
        name="Growth",
        monthlyPrice=59,
        annualPrice=708,
        unitLimit=25,
        description="Most popular plan",
        features=[
            "Everything in Starter",
            "Late fee automation",
            "Deposit vault and deadline alerts",
            "One-click dispute evidence export",
            "In-app landlord-tenant messaging",
            "Move-out comparison reports",
            "Priority support",
            "Custom late fee rules",
            "Bulk tenant invites",
        ],
        cta="Start Free Trial",
        link="/signup?plan=growth",
        badge="Most popular",
        featured=True,
    ),
    PricingPlan(
        id="pro",
        name="Pro",
        monthlyPrice=149,
        annualPrice=1788,
        unitLimit=None,
        description="For professional property managers",
        features=[
            "Everything in Growth",
            "Unlimited units",
            "Team access and roles",
            "White-label tenant portal",
            "API access",
            "Maintenance vendor management",
            "Portfolio-level reporting",
            "Dedicated account manager",
            "SLA-backed support",
            "Custom onboarding",
        ],
        cta="Start Free Trial",
        link="/signup?plan=pro",
    ),
]

TESTIMONIALS: List[Testimonial] = [
    Testimonial(
        id=1,
        quote="My tenant contested the full deposit after move-out. I had timestamped photos of every room from day one. The case was closed in my favor in under two weeks. Without RentProof, I would have lost $3,000.",
        author="David K.",
        role="Landlord -- 4 units -- Indianapolis, IN",
        category="deposit-dispute",
    ),
    Testimonial(
        id=2,
        quote="I used to spend three days every month tracking who paid and texting late tenants. Now it is fully automated. My tenants get reminded, late fees apply automatically, and I check a dashboard instead of a spreadsheet.",
        author="Patricia L.",
        role="Landlord -- 12 units -- Austin, TX",
        category="rent-tracking",
    ),
    Testimonial(
        id=3,
        quote="We switched from a legacy PM system that cost $300 a month and did half of what RentProof does. The maintenance tracking alone saved us from two tenant escalations last quarter. This is what the software should have been ten years ago.",
        author="Marcus R.",
        role="Property Manager -- 40 units -- Philadelphia, PA",
        category="maintenance",
    ),
]

STATS: List[Stat] = [
    Stat(
        id=1,
        number="$3.2B",
        label="in security deposits wrongfully withheld each year in the US",
        icon="dollar",
    ),
    Stat(
        id=2,
        number="42%",
        label="of landlords have faced a payment dispute with a tenant",
        icon="chart",
    ),
    Stat(
        id=3,
        number="6x",
        label="faster dispute resolution for RentProof users vs. the average",
        icon="lightning",
    ),
]


# ==================== Endpoints ====================

@router.get("/features", response_model=List[Feature])
async def get_features():
    """Get all platform features"""
    return FEATURES


@router.get("/pricing", response_model=List[PricingPlan])
async def get_pricing():
    """Get all pricing plans"""
    return PRICING_PLANS


@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all customer testimonials"""
    return TESTIMONIALS


@router.get("/stats", response_model=List[Stat])
async def get_stats():
    """Get platform statistics"""
    return STATS
