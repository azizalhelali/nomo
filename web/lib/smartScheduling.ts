// Smart Scheduling System - الوكيل يختار أفضل أوقات النشر

export interface ScheduledPost {
  id: string;
  profileId: string;
  platform: string;
  content: string;
  suggestedTime: Date; // الوقت المقترح من الوكيل
  userModifiedTime?: Date; // الوقت بعد تعديل المستخدم (إن وجد)
  accuracy: number; // دقة توليد المحتوى (0-100)
  status: 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: Date;
  approvedAt?: Date;
  publishedAt?: Date;
  timeModificationCount: number; // كم مرة عدّل المستخدم الوقت
  originalSuggestedTime?: Date; // الوقت الأصلي قبل التعديل (للتدريب)
}

export class SmartSchedulingService {
  private static readonly STORAGE_KEY = 'nomo_scheduled_posts';
  private static readonly BEST_TIMES_KEY = 'nomo_best_post_times';

  // ========== أفضل أوقات النشر الافتراضية ==========
  static getBestPostingTimes(platform: string): number[] {
    const defaultTimes: Record<string, number[]> = {
      instagram: [9, 12, 18, 20], // 9AM, 12PM, 6PM, 8PM
      twitter: [8, 11, 14, 17, 20], // 8AM, 11AM, 2PM, 5PM, 8PM
      linkedin: [7, 12, 17], // 7AM, 12PM, 5PM
      facebook: [13, 19, 21], // 1PM, 7PM, 9PM
      tiktok: [18, 20, 22], // 6PM, 8PM, 10PM
      youtube: [16, 19], // 4PM, 7PM
      newsletter: [19], // 7PM (evening for newsletters)
    };

    // محاولة الحصول على الأوقات المتعلمة من تعديلات المستخدم
    try {
      const stored = localStorage.getItem(`${this.BEST_TIMES_KEY}_${platform}`);
      if (stored) {
        const learned = JSON.parse(stored);
        return learned.times || defaultTimes[platform] || [12, 18];
      }
    } catch (err) {
      console.error('خطأ في قراءة أوقات النشر المتعلمة:', err);
    }

    return defaultTimes[platform] || [12, 18];
  }

  // ========== توليد منشور مع وقت مقترح ==========
  static generateScheduledPost(
    profileId: string,
    platform: string,
    content: string,
    accuracy: number
  ): ScheduledPost {
    const now = new Date();

    // الوكيل يختار أفضل وقت للنشر غداً أو الأيام القادمة
    const bestTimes = this.getBestPostingTimes(platform);
    const randomHour = bestTimes[Math.floor(Math.random() * bestTimes.length)];

    const suggestedTime = new Date();
    suggestedTime.setDate(suggestedTime.getDate() + 1); // غداً
    suggestedTime.setHours(randomHour, Math.floor(Math.random() * 60), 0);

    const post: ScheduledPost = {
      id: `post_${Date.now()}`,
      profileId,
      platform,
      content,
      suggestedTime,
      accuracy,
      status: 'pending',
      createdAt: now,
      timeModificationCount: 0,
    };

    this.savePost(post);
    return post;
  }

  // ========== الموافقة على المنشور (بالوقت الأصلي أو المعدّل) ==========
  static approvePost(
    profileId: string,
    postId: string,
    newSuggestedTime?: Date
  ): ScheduledPost | null {
    const post = this.getPost(profileId, postId);
    if (!post) return null;

    post.status = 'approved';
    post.approvedAt = new Date();

    // إذا عدّل المستخدم الوقت
    if (newSuggestedTime && newSuggestedTime.getTime() !== post.suggestedTime.getTime()) {
      post.originalSuggestedTime = post.suggestedTime;
      post.userModifiedTime = newSuggestedTime;
      post.suggestedTime = newSuggestedTime;
      post.timeModificationCount++;

      // تدريب الوكيل على أفضل أوقات النشر
      this.recordTimeLearning(profileId, post.platform, newSuggestedTime);
    }

    this.savePost(post);
    return post;
  }

  // ========== رفض المنشور ==========
  static rejectPost(profileId: string, postId: string): ScheduledPost | null {
    const post = this.getPost(profileId, postId);
    if (!post) return null;

    post.status = 'rejected';
    this.savePost(post);
    return post;
  }

  // ========== الحصول على المنشورات المنتظرة الموافقة ==========
  static getPendingPosts(profileId: string): ScheduledPost[] {
    try {
      const allPosts = this.getAllPosts(profileId);
      return allPosts.filter(p => p.status === 'pending').sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (err) {
      console.error('خطأ في قراءة المنشورات:', err);
      return [];
    }
  }

  // ========== الحصول على المنشورات المجدولة (للنشر التلقائي) ==========
  static getApprovedPosts(profileId: string): ScheduledPost[] {
    try {
      const allPosts = this.getAllPosts(profileId);
      return allPosts
        .filter(p => p.status === 'approved' && !p.publishedAt)
        .sort((a, b) => a.suggestedTime.getTime() - b.suggestedTime.getTime());
    } catch (err) {
      console.error('خطأ في قراءة المنشورات المجدولة:', err);
      return [];
    }
  }

  // ========== تدريب الوكيل على أوقات النشر الأمثل ==========
  private static recordTimeLearning(
    profileId: string,
    platform: string,
    modifiedTime: Date
  ): void {
    try {
      const key = `${this.BEST_TIMES_KEY}_${platform}`;
      let data = { times: this.getBestPostingTimes(platform), count: 0 };

      const stored = localStorage.getItem(key);
      if (stored) {
        data = JSON.parse(stored);
      }

      const hour = modifiedTime.getHours();

      // تحديث الأوقات المفضلة - إضافة الوقت المعدّل
      if (!data.times.includes(hour)) {
        data.times.push(hour);
      }
      data.times.sort((a, b) => a - b);
      data.count++;

      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('خطأ في تسجيل تعلم الأوقات:', err);
    }
  }

  // ========== Private Methods ==========
  private static getAllPosts(profileId: string): ScheduledPost[] {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY}_${profileId}`);
      if (!data) return [];

      const posts = JSON.parse(data);
      return posts.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        suggestedTime: new Date(p.suggestedTime),
        userModifiedTime: p.userModifiedTime ? new Date(p.userModifiedTime) : undefined,
        originalSuggestedTime: p.originalSuggestedTime ? new Date(p.originalSuggestedTime) : undefined,
        approvedAt: p.approvedAt ? new Date(p.approvedAt) : undefined,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : undefined,
      }));
    } catch (err) {
      console.error('خطأ في قراءة المنشورات:', err);
      return [];
    }
  }

  private static getPost(profileId: string, postId: string): ScheduledPost | null {
    const posts = this.getAllPosts(profileId);
    return posts.find(p => p.id === postId) || null;
  }

  private static savePost(post: ScheduledPost): void {
    const posts = this.getAllPosts(post.profileId);
    const index = posts.findIndex(p => p.id === post.id);

    if (index !== -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }

    localStorage.setItem(
      `${this.STORAGE_KEY}_${post.profileId}`,
      JSON.stringify(posts)
    );
  }
}
