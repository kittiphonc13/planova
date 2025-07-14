from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from ...db.database import get_db
from ...models.models import User, Subscription
from ...schemas.schemas import (
    SubscriptionCreate,
    Subscription as SubscriptionSchema,
    Role
)
from ...core.security import get_current_active_user

router = APIRouter()


@router.post("/subscribe", response_model=SubscriptionSchema)
def subscribe_to_premium(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Subscribe user to premium tier
    
    Note: In a real application, this would integrate with a payment processor
    like Stripe or Paddle. For this demo, we'll just upgrade the user directly.
    """
    # Check if subscription already exists
    db_subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    if db_subscription and db_subscription.is_active and db_subscription.tier == Role.PREMIUM:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an active premium subscription"
        )
    
    # Set subscription end date (30 days from now)
    end_date = datetime.utcnow() + timedelta(days=30)
    
    if db_subscription:
        # Update existing subscription
        db_subscription.tier = Role.PREMIUM
        db_subscription.start_date = datetime.utcnow()
        db_subscription.end_date = end_date
        db_subscription.is_active = True
    else:
        # Create new subscription
        db_subscription = Subscription(
            user_id=current_user.id,
            tier=Role.PREMIUM,
            start_date=datetime.utcnow(),
            end_date=end_date,
            is_active=True
        )
        db.add(db_subscription)
    
    # Update user role
    current_user.role = Role.PREMIUM
    
    db.commit()
    db.refresh(db_subscription)
    
    return db_subscription


@router.get("/subscription", response_model=SubscriptionSchema)
def get_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user's subscription
    """
    db_subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    if not db_subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No subscription found"
        )
    
    return db_subscription


@router.post("/cancel-subscription", response_model=SubscriptionSchema)
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Cancel premium subscription
    
    Note: In a real application, this would integrate with a payment processor.
    For this demo, we'll just downgrade the user directly.
    """
    # Check if subscription exists
    db_subscription = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    
    if not db_subscription or not db_subscription.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active subscription found"
        )
    
    # Cancel subscription
    db_subscription.is_active = False
    db_subscription.end_date = datetime.utcnow()
    
    # Update user role
    current_user.role = Role.FREE
    
    db.commit()
    db.refresh(db_subscription)
    
    return db_subscription
