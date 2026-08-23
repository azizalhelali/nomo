// Content Generation Service - الوكيل يولد المحتوى تلقائياً

import { SmartSchedulingService } from './smartScheduling';
import { AgentInstructionsService } from './agentInstructions';
import { AIAgentTrainingService } from './aiAgentTraining';

export interface GeneratedContent {
  platform: string;
  content: string;
  accuracy: number; // 0-100
}

export class ContentGenerationService {
  // ========== توليد محتوى يومي تلقائي ==========
  static async generateDailyContent(profileId: string): Promise<void> {
    try {
      const platforms = ['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'newsletter'];

      for (const platform of platforms) {
        const content = await this.generateContentForPlatform(profileId, platform);
        if (content) {
          // حفظ المحتوى بانتظار الموافقة
          SmartSchedulingService.generateScheduledPost(
            profileId,
            platform,
            content.content,
            content.accuracy
          );
        }
      }

      console.log(`✅ تم توليد محتوى لـ ${platforms.length} منصات`);
    } catch (err) {
      console.error('خطأ في توليد المحتوى:', err);
    }
  }

  // ========== توليد محتوى لمنصة محددة ==========
  private static async generateContentForPlatform(
    profileId: string,
    platform: string
  ): Promise<GeneratedContent | null> {
    try {
      // الحصول على التعليمات المخصصة للمنصة
      const instructions = AgentInstructionsService.getPlatformInstructions(profileId, platform);

      // الحصول على بيانات التدريب
      const trainingStats = AIAgentTrainingService.getTrainingStats(profileId);

      // بناء الـ prompt
      let prompt = `أنت وكيل النمو. قم بتوليد محتوى احترافي لـ ${platform}`;

      // إضافة التعليمات المخصصة
      if (instructions.length > 0) {
        prompt += '\n\nالتعليمات المخصصة:\n';
        instructions.forEach(instr => {
          prompt += `- ${instr.title}: ${instr.instruction}\n`;
        });
      }

      // إضافة المعلومات عن أسلوب المستخدم
      if (trainingStats.writingPatterns.length > 0) {
        prompt += `\n\nأسلوب المستخدم: ${trainingStats.writingPatterns.join(', ')}\n`;
      }

      // توليد محتوى مثالي حسب المنصة
      const content = this.mockGenerateContent(platform, prompt);
      const accuracy = Math.min(100, trainingStats.averageAccuracy + 5); // يزداد الـ accuracy مع الوقت

      return {
        platform,
        content,
        accuracy,
      };
    } catch (err) {
      console.error(`خطأ في توليد محتوى ${platform}:`, err);
      return null;
    }
  }

  // ========== محاكاة توليد المحتوى (في الحقيقة ستكون API call) ==========
  private static mockGenerateContent(platform: string, prompt: string): string {
    const templates: Record<string, () => string> = {
      instagram: () => `📸 سلايد احترافي بخط ثمانية:
\n🎨 تصميم: ألوان جريئة وجذابة
\n✨ عنوان رئيسي: "اكتشف أسرار النجاح"
\n📝 نص ثانوي: 2-3 أسطر مختارة بعناية
\n🎯 CTA: اضغط على الرابط`,

      twitter: () => `1️⃣ هل تعرف أن معظم رواد الأعمال يركزون على الخطأ الشيء؟
\n
2️⃣ الحقيقة: النجاح ليس عن الكمال، بل عن التعلم المستمر
\n
3️⃣ اليوم سأشارك معك 5 دروس تغيرت حياتي
\n
4️⃣ الدرس الأول: لا تخاف من الفشل #entrepreneurship #نصائح
\n
5️⃣ ما هو أكبر درس تعلمته من الفشل؟ 👇`,

      linkedin: () => `💼 مقالة احترافية:
\n
"كيفية بناء فريق عمل ناجح في 2026"
\n
تحديات الفريق الحديث تتطلب نهج جديد. بعد 10 سنوات في القيادة، تعلمت:
\n
1. الثقة أهم من السيطرة
2. الاستماع أقوى من الأوامر
3. التطور المستمر ضرورة
\n
ما التحدي الأكبر في فريقك؟`,

      facebook: () => `👋 مرحباً بكم في مجتمعنا!
\n
اليوم نتحدث عن: "كيف تحقق أحلامك في 30 يوم"
\n
💡 الخطوة الأولى: اكتب حلمك الآن
\n
❤️ شارك تجربتك معنا
\n
👍 اضغط إعجاب إذا استفدت`,

      tiktok: () => `⚡ نصيحة سريعة:
\nهل تريد أن تكون منتجاً؟
إليك السر: البدء أهم من الكمال!
\n#نصائح #إنتاجية #تحفيز`,

      newsletter: () => `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Arial', sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #2c3e50; text-align: center; }
    .content { line-height: 1.6; color: #333; }
  </style>
</head>
<body>
  <div class="container">
    <h1>النشرة البريدية الأسبوعية</h1>
    <div class="content">
      <p>مرحباً بك في نشرتنا الأسبوعية!</p>
      <p>هذا الأسبوع نتحدث عن: كيفية إدارة وقتك بكفاءة</p>
      <p>استمتع بقراءة المقالات المختارة بعناية.</p>
    </div>
  </div>
</body>
</html>`,
    };

    const generator = templates[platform] || (() => 'محتوى عام');
    return generator();
  }

  // ========== التحقق من جدولة النشر التلقائي ==========
  static async publishScheduledPosts(profileId: string): Promise<void> {
    try {
      const approved = SmartSchedulingService.getApprovedPosts(profileId);
      const now = new Date();

      for (const post of approved) {
        if (post.suggestedTime <= now && !post.publishedAt) {
          // محاكاة النشر (في الحقيقة: API call للمنصة)
          console.log(`📤 نشر على ${post.platform}: ${post.content.substring(0, 50)}...`);

          // تحديث حالة المنشور
          post.publishedAt = now;
          post.status = 'published';

          // حفظ في localStorage (في الحقيقة: قاعدة بيانات)
          // (يتم من خلال SmartSchedulingService)
        }
      }
    } catch (err) {
      console.error('خطأ في نشر المحتوى:', err);
    }
  }
}
