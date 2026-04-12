const API_BASE = 'http://localhost:8000';

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Login failed');
  return data;
};

export const register = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Registration failed');
  return data;
};

export const verifyEmail = async (username, otp) => {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, otp })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Verification failed');
  return true;
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/laundry/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to create order');
  return data;
};

export const getOrdersByUser = async (enrollmentNumber) => {
  const res = await fetch(`${API_BASE}/laundry/user/${enrollmentNumber}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch orders');
  return data;
};

export const getAllOrders = async () => {
  const res = await fetch(`${API_BASE}/laundry/orders`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch orders');
  return data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Update status failed');
  return data;
};

export const updateOrderPickupDate = async (orderId, pickupDate, pickupTime) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}/pickup`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pickupDate, pickupTime })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Update pickup failed');
  return data;
};

export const getOrderById = async (orderId) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Failed to fetch order');
  return data;
};

export const confirmOrder = async (orderId) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}/confirm`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Confirmation failed');
  return data;
};

export const rejectOrder = async (orderId) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}/reject`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Rejection failed');
  return data.success;
};

export const confirmUserPickup = async (orderId) => {
  const res = await fetch(`${API_BASE}/laundry/order/${orderId}/pickup-confirm`, {
    method: 'POST'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || 'Pickup confirmation failed');
  return data;
};
