'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import {
  requestNotificationPermission,
  getPermissionStatus,
} from '@/lib/reminders/notification-manager';

interface ReminderDialogProps {
  actionId?: string;
  triggerLabel?: string;
}

const REMINDER_OPTIONS = [
  { days: 1, en: 'Tomorrow', he: 'מחר' },
  { days: 3, en: 'In 3 days', he: 'בעוד 3 ימים' },
  { days: 7, en: 'In 1 week', he: 'בעוד שבוע' },
  { days: 30, en: 'In 1 month', he: 'בעוד חודש' },
];

export function ReminderDialog({ actionId, triggerLabel }: ReminderDialogProps) {
  const locale = useLocale();
  const isHe = locale === 'he';
  const { addReminder } = useCalculatorStore();
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function handleSetReminder(days: number) {
    const permission = await requestNotificationPermission();
    if (permission === 'denied') {
      setPermissionDenied(true);
      return;
    }

    const date = Date.now() + days * 24 * 60 * 60 * 1000;
    const title = isHe
      ? `תזכורת: בצעו את הפעולה האזרחית שלכם`
      : `Reminder: Complete your civic action`;

    addReminder({ title, date, actionId });
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setOpen(false);
    }, 1500);
  }

  const notificationStatus = getPermissionStatus();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="xs" className="gap-1 text-xs">
          <Bell className="size-3" />
          {triggerLabel ?? (isHe ? 'הזכירו לי' : 'Remind me')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isHe ? 'הגדרת תזכורת' : 'Set a Reminder'}
          </DialogTitle>
          <DialogDescription>
            {isHe
              ? 'בחרו מתי לקבל תזכורת לביצוע הפעולה'
              : 'Choose when to be reminded to take action'}
          </DialogDescription>
        </DialogHeader>

        {confirmed ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Check className="size-8 text-green-600" />
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              {isHe ? 'תזכורת נקבעה!' : 'Reminder set!'}
            </p>
          </div>
        ) : permissionDenied ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isHe
                ? 'הרשאת התראות נדחתה. אפשרו התראות בהגדרות הדפדפן.'
                : 'Notification permission denied. Enable notifications in browser settings.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 py-2">
            {REMINDER_OPTIONS.map((option) => (
              <Button
                key={option.days}
                variant="outline"
                className="h-auto py-3"
                onClick={() => handleSetReminder(option.days)}
              >
                {isHe ? option.he : option.en}
              </Button>
            ))}
          </div>
        )}

        {notificationStatus === 'unsupported' && (
          <p className="text-xs text-muted-foreground text-center">
            {isHe
              ? 'הדפדפן שלכם לא תומך בהתראות'
              : 'Your browser does not support notifications'}
          </p>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
