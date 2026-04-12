from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.email_service import send_receipt_email, send_ready_for_pickup_email, send_collection_confirmation
import database.supabase_db as db

router = APIRouter()

class OrderUpdateStatus(BaseModel):
    status: str

class OrderUpdatePickup(BaseModel):
    pickupDate: str
    pickupTime: Optional[str] = None

@router.post("/order")
async def create_order(order_data: Dict[Any, Any]):
    # Keep user data in order for receipt notifications
    user = None
    if order_data.get("userId"):
        user = db.db_get_user_by_id(order_data["userId"])
    elif order_data.get("username"):
        user = db.db_get_user_by_username(order_data["username"])

    if user:
        order_data["userEmail"] = user.get("email")
        order_data["username"] = user.get("username")
        order_data["enrollmentNumber"] = order_data.get("enrollmentNumber", user.get("enrollmentNumber"))

    new_order = db.db_create_order(order_data)
    return new_order

@router.get("/user/{enrollment}")
async def get_user_orders(enrollment: str):
    return db.db_get_orders_by_user(enrollment)

@router.get("/orders")
async def get_all_orders():
    return db.db_get_all_orders()

@router.get("/order/{orderId}")
async def get_order(orderId: str):
    o = db.db_get_order(orderId)
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    return o

@router.put("/order/{orderId}/status")
async def update_status(orderId: str, req: OrderUpdateStatus):
    o = db.db_update_order_status(orderId, req.status)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    # If laundry is ready for pickup, notify user by email
    if req.status.lower() == "ready for pickup":
        user = None
        if o.get("userId"):
            user = db.db_get_user_by_id(o["userId"])
        if not user and o.get("username"):
            user = db.db_get_user_by_username(o["username"])

        if user and user.get("email"):
            await send_ready_for_pickup_email(user["email"], o["orderId"])

    return o

@router.put("/order/{orderId}/pickup")
async def update_pickup(orderId: str, req: OrderUpdatePickup):
    o = db.db_update_order_pickup(orderId, req.pickupDate, req.pickupTime)
    if not o: raise HTTPException(status_code=404, detail="Order not found")
    return o

@router.post("/order/{orderId}/confirm")
async def confirm_order(orderId: str):
    o = db.db_confirm_order(orderId)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    user = None
    if o.get("userId"):
        user = db.db_get_user_by_id(o["userId"])
    if not user and o.get("username"):
        user = db.db_get_user_by_username(o["username"])

    if user and user.get("email"):
        details = [f"Order ID: {o['orderId']}"]
        details.append(f"Status: {o.get('status', 'Confirmed')}")
        details.append(f"Pickup Date: {o.get('preferredPickupDate', 'Not set')}")
        details.append(f"Pickup Time: {o.get('preferredPickupTime', 'Not set')}")

        items = o.get("items")
        if isinstance(items, list) and items:
            details.append("\nLaundry Items:")
            for item in items:
                name = item.get("name") or item.get("id") or "Item"
                qty = item.get("quantity") or item.get("qty") or 1
                details.append(f"- {name}: {qty}")
        else:
            details.append("\nLaundry Items: Not specified")

        if o.get("specialInstructions"):
            details.append(f"\nSpecial Instructions: {o.get('specialInstructions')}")

        await send_receipt_email(user["email"], "\n".join(details))
    return o

@router.post("/order/{orderId}/reject")
async def reject_order(orderId: str):
    success = db.db_reject_order(orderId)
    if not success: raise HTTPException(status_code=404, detail="Order not found")
    return {"success": True}

@router.post("/order/{orderId}/pickup-confirm")
async def confirm_user_pickup(orderId: str):
    o = db.db_confirm_user_pickup(orderId)
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")
    # Fetch user to send pickup confirmation
    user = None
    if o.get("userId"):
        user = db.db_get_user_by_id(o["userId"])
    if not user and o.get("username"):
        user = db.db_get_user_by_username(o["username"])

    if user and user.get("email"):
        await send_collection_confirmation(user["email"], o["orderId"])
    return o
