import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
  AndroidStyle,
  AndroidCategory,
  AndroidNotificationSetting,
  AuthorizationStatus,
} from '@notifee/react-native';

export async function requestNotificationPermission() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();
}

export async function checkNotificationPermissions() {
  const settings = await notifee.getNotificationSettings();

  // On Android, check if alarm permission is needed
  if (settings.android?.alarm === AndroidNotificationSetting.ENABLED) {
    return true;
  }

  // On iOS, check if notification permission is granted
  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    return true;
  }

  return false;
}

export async function scheduleWeeklyNotification() {
  // Request permissions if not already granted
  await requestNotificationPermission();

  // Check if we have the necessary permissions
  const hasPermission = await checkNotificationPermissions();
  if (!hasPermission) {
    console.warn('Notification permissions not granted');
    return false;
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'weekly-reminder',
    name: 'Weekly Reminder',
    importance: AndroidImportance.HIGH,
    vibration: true,
    sound: 'default',
  });

  // Calculate next Sunday at 8 PM
  const now = new Date();
  const nextSunday = new Date();

  // Set to next Sunday
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7));

  // Set time to 8 PM
  nextSunday.setHours(20, 0, 0, 0);

  // If we've already passed 8 PM today (Sunday), schedule for next week
  if (nextSunday <= now) {
    nextSunday.setDate(nextSunday.getDate() + 7);
  }

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: nextSunday.getTime(),
    repeatFrequency: RepeatFrequency.WEEKLY,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  try {
    // Cancel any existing notifications with the same ID
    await notifee.cancelNotification('weekly-reminder');

    // Schedule the notification
    await notifee.createTriggerNotification(
      {
        id: 'weekly-reminder',
        title: 'Weekly Reflection Time',
        body: "It's time for your weekly reflection. How was your week?",
        android: {
          channelId,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          category: AndroidCategory.REMINDER,
          style: {
            type: AndroidStyle.BIGTEXT,
            text: 'Take a moment to reflect on your week and plan for the next one.',
          },
        },
        ios: {
          sound: 'default',
          categoryId: 'WEEKLY_REMINDER',
        },
      },
      trigger,
    );

    console.log('Weekly notification scheduled for', nextSunday);
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

export async function cancelScheduledNotifications() {
  await notifee.cancelNotification('weekly-reminder');
}
