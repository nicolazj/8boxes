import { useEffect } from 'react';
import {
  checkNotificationPermissions,
  scheduleWeeklyNotification,
} from '../utils/notifications';

export function NotificationSetup() {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await checkNotificationPermissions();

        if (permission) {
          await scheduleWeeklyNotification();
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  return null;
}
