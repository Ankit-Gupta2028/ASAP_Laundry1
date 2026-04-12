import uuid
from typing import Optional
from datetime import datetime
from supabase import create_client
from core.config import settings

def _get_client():
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise RuntimeError("Supabase URL/KEY not configured in environment")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def _get_table(table_name: str):
    return _get_client().table(table_name)

def map_user(user: dict) -> Optional[dict]:
    if not user: return None
    return {
        "id": user.get("id"),
        "role": user.get("role"),
        "username": user.get("username"),
        "email": user.get("email"),
        "password_hash": user.get("password_hash"),
        "isEmailVerified": user.get("is_email_verified", False),
        "enrollmentNumber": user.get("enrollment_number", ""),
        "bagNumber": user.get("bag_number", ""),
        "created_at": user.get("created_at")
    }

def map_order(order: dict) -> Optional[dict]:
    if not order: return None
    return {
        "orderId": order.get("order_id"),
        "userId": order.get("user_id"),
        "username": order.get("username"),
        "userEmail": order.get("user_email"),
        "enrollmentNumber": order.get("enrollment_number"),
        "items": order.get("items", []),
        "preferredPickupDate": order.get("preferred_pickup_date"),
        "preferredPickupTime": order.get("preferred_pickup_time"),
        "specialInstructions": order.get("special_instructions"),
        "pickupDate": order.get("pickup_date"),
        "pickupTime": order.get("pickup_time"),
        "status": order.get("status"),
        "userPickupConfirmed": order.get("user_pickup_confirmed", False),
        "isConfirmed": order.get("is_confirmed", False),
        "orderDate": order.get("order_date")
    }

def db_create_user(user_data: dict, hashed_password: str) -> dict:
    student_id = user_data.get("studentId") or user_data.get("enrollmentNumber")
    if not student_id:
        student_id = "EN" + uuid.uuid4().hex[:5]
        
    user = {
        "username": user_data["username"],
        "email": user_data.get("email"),
        "password_hash": hashed_password,
        "role": user_data.get("role", "user"),
        "is_email_verified": False,
        "enrollment_number": student_id,
        "bag_number": user_data.get("bagNumber", ""),
        "created_at": datetime.utcnow().isoformat(),
    }
    response = _get_table("users").insert(user).execute()
    return map_user(response.data[0])

def db_get_user_by_username(username: str) -> Optional[dict]:
    try:
        response = _get_table("users").select("*").eq("username", username).single().execute()
        return map_user(response.data) if response.data else None
    except Exception:
        return None

def db_get_user_by_email(email: str) -> Optional[dict]:
    try:
        response = _get_table("users").select("*").eq("email", email).single().execute()
        return map_user(response.data) if response.data else None
    except Exception:
        return None

def db_get_user_by_id(user_id: str) -> Optional[dict]:
    try:
        response = _get_table("users").select("*").eq("id", user_id).single().execute()
        return map_user(response.data) if response.data else None
    except Exception:
        return None

def db_update_user_verified(username: str) -> Optional[dict]:
    response = _get_table("users").update({"is_email_verified": True}).eq("username", username).execute()
    return map_user(response.data[0]) if response.data else None

def db_store_otp(username: str, otp: str, expires_at: datetime) -> None:
    record = {
        "username": username,
        "otp": otp,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.utcnow().isoformat(),
    }
    _get_table("otps").upsert(record, on_conflict="username").execute()

def db_get_otp(username: str) -> Optional[dict]:
    try:
        response = _get_table("otps").select("*").eq("username", username).single().execute()
        return response.data if response.data else None
    except Exception:
        return None

def db_delete_otp(username: str) -> None:
    _get_table("otps").delete().eq("username", username).execute()

def db_create_order(order_data: dict) -> dict:
    order = {
        "order_id": "ORD-" + uuid.uuid4().hex[:8].upper(),
        "status": "Unpack",
        "user_pickup_confirmed": False,
        "is_confirmed": False,
        "order_date": datetime.utcnow().isoformat(),
        
        "user_id": order_data.get("userId"),
        "username": order_data.get("username"),
        "user_email": order_data.get("userEmail"),
        "enrollment_number": order_data.get("enrollmentNumber"),
        "items": order_data.get("items", []),
        "preferred_pickup_date": order_data.get("preferredPickupDate"),
        "preferred_pickup_time": order_data.get("preferredPickupTime"),
        "special_instructions": order_data.get("specialInstructions"),
        "pickup_date": order_data.get("pickupDate"),
        "pickup_time": order_data.get("pickupTime")
    }
    response = _get_table("orders").insert(order).execute()
    return map_order(response.data[0])

def db_get_orders_by_user(enrollment_number: str) -> list:
    try:
        response = _get_table("orders").select("*").eq("enrollment_number", enrollment_number).order("order_date", desc=True).execute()
        return [map_order(o) for o in response.data] if response.data else []
    except Exception:
        return []

def db_get_all_orders() -> list:
    try:
        response = _get_table("orders").select("*").order("order_date", desc=True).execute()
        return [map_order(o) for o in response.data] if response.data else []
    except Exception:
        return []

def db_get_order(order_id: str) -> Optional[dict]:
    try:
        response = _get_table("orders").select("*").eq("order_id", order_id).single().execute()
        return map_order(response.data) if response.data else None
    except Exception:
        return None

def db_update_order_status(order_id: str, status: str) -> Optional[dict]:
    response = _get_table("orders").update({"status": status}).eq("order_id", order_id).execute()
    return map_order(response.data[0]) if response.data else None

def db_update_order_pickup(order_id: str, date: str, time: str) -> Optional[dict]:
    response = _get_table("orders").update({"pickup_date": date, "pickup_time": time}).eq("order_id", order_id).execute()
    return map_order(response.data[0]) if response.data else None

def db_confirm_order(order_id: str) -> Optional[dict]:
    response = _get_table("orders").update({"is_confirmed": True}).eq("order_id", order_id).execute()
    return map_order(response.data[0]) if response.data else None

def db_reject_order(order_id: str) -> bool:
    try:
        response = _get_table("orders").delete().eq("order_id", order_id).execute()
        return len(response.data) > 0
    except Exception:
        return False

def db_confirm_user_pickup(order_id: str) -> Optional[dict]:
    response = _get_table("orders").update({"user_pickup_confirmed": True, "status": "Picked Up"}).eq("order_id", order_id).execute()
    return map_order(response.data[0]) if response.data else None
