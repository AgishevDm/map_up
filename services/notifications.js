import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationManager {
  constructor() {
    this.activeNotifications = new Map();
    this.markerCooldowns = new Map();
    this.lastGlobalNotificationTime = 0;
  }

  async requestPermissions() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        return newStatus === 'granted';
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

   async triggerNotification(markerId, title, body, ignoreCooldown = false) {
    const now = Date.now();
    
    
    // Игнорировать кулдаун для специальных уведомлений
    if (!ignoreCooldown) {
      // Глобальный кулдаун 30 секунд
      if (now - this.lastGlobalNotificationTime < 30000) return;
      
      // Кулдаун для метки 5 минут
      const lastMarkerTime = this.markerCooldowns.get(markerId) || 0;
      if (now - lastMarkerTime < 30000) return;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: { title, body, sound: 'default' },
        trigger: null,
      });

      if (!ignoreCooldown) {
        this.activeNotifications.set(markerId, notificationId);
        this.markerCooldowns.set(markerId, now);
        this.lastGlobalNotificationTime = now;
      }
      
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  cancelNotification(markerId) {
    const notificationId = this.activeNotifications.get(markerId);
    if (notificationId) {
      Notifications.cancelScheduledNotificationAsync(notificationId);
      this.activeNotifications.delete(markerId);
    }
    this.markerCooldowns.delete(markerId);
  }
 
  clearAllNotifications() {
    Notifications.cancelAllScheduledNotificationsAsync();
    this.activeNotifications.clear();
    this.markerCooldowns.clear();
  }
}

export const notificationManager = new NotificationManager();