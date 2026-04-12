from typing import Optional
import uuid

# Temporary In-Memory Storage tailored for frontend
_users = []   # List of dicts
_otps = {}    # username -> { "otp": "...", "expires_at": datetime }
_orders = []  # List of dicts

# Initialize with admin and user like the frontend did
_users.extend([
    {"id": "admin1", "username": "admin", "password_hash": "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", "role": "admin", "email": "admin@example.com", "isEmailVerified": True, "enrollmentNumber": "ADMIN123"},
    {"id": "user1", "username": "user", "password_hash": "$pbkdf2-sha256$29000$KYVQSoWX.yBScWly6z38rxJ2V1VdfCV.xW", "role": "user", "email": "user@example.com", "isEmailVerified": True, "enrollmentNumber": "EN12345"}
])

def db_create_user(user_data: dict, hashed_password: str) -> dict:
    student_id = user_data.get("studentId")
    if not student_id:
        student_id = "EN" + uuid.uuid4().hex[:5]
    new_user = {
        "id": "usr_" + uuid.uuid4().hex[:8],
        "role": user_data.get("role", "user"),
        "username": user_data["username"],
        "email": user_data.get("email"),
        "password_hash": hashed_password,
        "isEmailVerified": False,
        "enrollmentNumber": student_id,
        "bagNumber": user_data.get("bagNumber", "")
    }
    _users.append(new_user)
    return new_user

def db_get_user_by_username(username: str) -> Optional[dict]:
    for u in _users:
        if u["username"] == username: return u
    return None

def db_get_user_by_email(email: str) -> Optional[dict]:
    for u in _users:
        if u.get("email") == email: return u
    return None

def db_get_user_by_id(user_id: str) -> Optional[dict]:
    for u in _users:
        if u.get("id") == user_id: return u
    return None

def db_store_otp(username: str, otp: str, expires_at) -> None:
    _otps[username] = {"otp": otp, "expires_at": expires_at}

def db_get_otp(username: str) -> Optional[dict]:
    return _otps.get(username)

def db_delete_otp(username: str) -> None:
    if username in _otps:
        _otps.pop(username, None)

def db_update_user_verified(username: str):
    for u in _users:
        if u["username"] == username:
            u["isEmailVerified"] = True
            return u
    return None

def db_create_order(order_data: dict) -> dict:
    new_order = {
        "orderId": "ORD-" + uuid.uuid4().hex[:6].upper(),
        "status": "Unpack",
        "userPickupConfirmed": False,
        "isConfirmed": False,
        **order_data,
    }
    if "orderDate" not in new_order:
        from datetime import datetime
        new_order["orderDate"] = datetime.now().isoformat()
    _orders.append(new_order)
    return new_order

def db_get_orders_by_user(enrollmentNumber: str) -> list:
    filtered = [o for o in _orders if o.get("enrollmentNumber") == enrollmentNumber]
    return sorted(filtered, key=lambda x: x.get("orderDate", ""), reverse=True)

def db_get_all_orders() -> list:
    return sorted(_orders, key=lambda x: x.get("orderDate", ""), reverse=True)

def db_update_order_status(orderId: str, status: str) -> Optional[dict]:
    for o in _orders:
        if o["orderId"] == orderId:
            o["status"] = status
            return o
    return None

def db_update_order_pickup(orderId: str, date: str, time: str) -> Optional[dict]:
    for o in _orders:
        if o["orderId"] == orderId:
            o["pickupDate"] = date
            if time: o["pickupTime"] = time
            return o
    return None

def db_get_order(orderId: str) -> Optional[dict]:
    for o in _orders:
        if o["orderId"] == orderId: return o
    return None

def db_confirm_order(orderId: str) -> Optional[dict]:
    for o in _orders:
        if o["orderId"] == orderId:
            o["isConfirmed"] = True
            return o
    return None

def db_reject_order(orderId: str) -> bool:
    global _orders
    initial_len = len(_orders)
    _orders = [o for o in _orders if o["orderId"] != orderId]
    return len(_orders) < initial_len

def db_confirm_user_pickup(orderId: str) -> Optional[dict]:
    for o in _orders:
        if o["orderId"] == orderId:
            o["userPickupConfirmed"] = True
            o["status"] = "Picked Up"
            return o
    return None
