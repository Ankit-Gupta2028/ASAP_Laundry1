export const ITEM_PRICES = {
  shirt: 2.0,
  pants: 3.5,
  tshirt: 1.5,
  jeans: 4.0,
  jacket: 6.0,
  others: 2.5
};

export const calculateOrderTotal = (items) => {
  if (!items || !items.length) return 0;
  return items.reduce((total, item) => {
    // If the ID matches, use the specific price, else fallback to 'others'
    const pricePerUnit = ITEM_PRICES[item.id] || ITEM_PRICES['others'];
    return total + (pricePerUnit * item.quantity);
  }, 0);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
