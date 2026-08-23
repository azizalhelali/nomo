'use client';

import { useEffect, useState } from 'react';

interface NotificationOptions {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('متصفحك لا يدعم الإخطارات');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (err) {
        console.error('خطأ في طلب الأذن:', err);
        return false;
      }
    }

    return false;
  }

  static async sendNotification(options: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        if (registration.active) {
          await registration.active.controller?.postMessage({
            type: 'SEND_NOTIFICATION',
            payload: {
              title: options.title,
              body: options.body,
              url: options.url || '/app/dashboard',
              tag: options.tag,
              requireInteraction: options.requireInteraction || false
            }
          });
        }
      } catch (err) {
        console.error('خطأ في تسجيل service worker:', err);
      }
    }

    // Fallback: show notification directly
    try {
      new Notification(options.title, {
        badge: '/nomo-logo.png',
        icon: '/nomo-logo.png',
        body: options.body,
        tag: options.tag,
        requireInteraction: options.requireInteraction || false
      });
    } catch (err) {
      console.error('خطأ في عرض الإخطار:', err);
    }
  }

  // Predefined notifications
  static async notifyWeeklyApproval(): Promise<void> {
    await this.sendNotification({
      title: 'موعد الموافقة الأسبوعية! 📝',
      body: 'راجع واعتمد المنشورات المجدولة للأسبوع',
      url: '/app/approval',
      tag: 'weekly-approval',
      requireInteraction: true
    });
  }

  static async notifyPublishSuccess(accountName: string): Promise<void> {
    await this.sendNotification({
      title: '✅ تم النشر بنجاح!',
      body: `تم نشر منشور على ${accountName}`,
      url: '/app/dashboard',
      tag: 'publish-success'
    });
  }

  static async notifyPublishError(accountName: string): Promise<void> {
    await this.sendNotification({
      title: '❌ خطأ في النشر',
      body: `فشل نشر منشور على ${accountName}`,
      url: '/app/pending',
      tag: 'publish-error',
      requireInteraction: true
    });
  }

  static async notifyDailyStats(): Promise<void> {
    await this.sendNotification({
      title: '📊 ملخص اليوم متوفر',
      body: 'شاهد إحصائيات أداء حساباتك لهذا اليوم',
      url: '/app/dashboard',
      tag: 'daily-stats'
    });
  }

  static async notifyWeeklyReport(): Promise<void> {
    await this.sendNotification({
      title: '📈 التقرير الأسبوعي جاهز!',
      body: 'اطلع على تقرير الأسبوع الشامل',
      url: '/app/dashboard',
      tag: 'weekly-report',
      requireInteraction: true
    });
  }

  static async notifyLowContent(): Promise<void> {
    await this.sendNotification({
      title: '⚠️ المحتوى ينفد',
      body: 'لديك منشورات قليلة. يمكنك توليد محتوى جديد',
      url: '/app/settings',
      tag: 'low-content'
    });
  }
}

export default function NotificationManager() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'loading'>('loading');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionStatus('denied');
      return;
    }

    setPermissionStatus(Notification.permission);

    // Request permission on mount
    if (Notification.permission === 'default') {
      NotificationService.requestPermission().then(() => {
        setPermissionStatus(Notification.permission);
      });
    }
  }, []);

  // These notifications would be triggered by actual events
  // For now, they're just imported by the app and called when needed

  return null;
}
