/**
 * Browser Notification API wrapper for civic action reminders.
 * Falls back gracefully when notifications are unavailable (SSR, denied permission).
 */

export type NotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export function getNotificationSupport(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermissionStatus(): NotificationPermission {
  if (!getNotificationSupport()) return 'unsupported';
  return Notification.permission as NotificationPermission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!getNotificationSupport()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  const result = await Notification.requestPermission();
  return result as NotificationPermission;
}

export function showNotification(title: string, body: string): void {
  if (getPermissionStatus() !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  });
}

/**
 * Check for due reminders and show notifications.
 * Called on app load / periodic interval.
 */
export function checkDueReminders(
  reminders: Array<{ id: string; title: string; date: number; notified: boolean }>,
  onNotified: (id: string) => void
): void {
  if (getPermissionStatus() !== 'granted') return;

  const now = Date.now();
  for (const reminder of reminders) {
    if (!reminder.notified && reminder.date <= now) {
      showNotification('Open Shekel', reminder.title);
      onNotified(reminder.id);
    }
  }
}
