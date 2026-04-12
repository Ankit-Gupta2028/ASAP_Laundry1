export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }
  
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return false;
};

export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: '/vite.svg',
      ...options
    });
    
    // Auto close after 5 seconds to keep it clean
    setTimeout(() => notification.close(), 5000);
  }
};
