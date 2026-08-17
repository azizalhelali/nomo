# 🌱 نمو - Nomo

**تطبيق ويب متقدم (PWA) لإدارة جميع حسابات وسائل التواصل الاجتماعي من مكان واحد**

![Nomo App](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue?style=flat-square)

---

## 🎯 الرؤية

تطبيق سهل وقوي يمكّنك من:
- ✨ إدارة عدة بروفايلات (حسابات Instagram مختلفة مثلاً)
- 📱 تسجيل دخول واحد لجميع حساباتك
- 🔐 دخول سريع بواسطة Biometric (Face ID / Touch ID)
- 📊 متابعة إحصائيات كل حساب
- ⏳ إدارة المحتوى المعلق للموافقة

---

## 🚀 البدء السريع

### المتطلبات
```bash
Node.js 18+
npm أو yarn
```

### التثبيت
```bash
# 1. الانتقال للمجلد
cd web

# 2. تثبيت المكتبات
npm install

# 3. تشغيل الخادم
npm run dev
```

### الوصول للتطبيق
```
http://localhost:3000
```

### بيانات الدخول التجريبية
- **اسم المستخدم:** demo
- **كلمة المرور:** demo123

---

## 📸 لقطات الشاشة

### شاشة تسجيل الدخول
واجهة بسيطة وأنيقة لتسجيل الدخول

### صفحة البروفايلات
اختيار من عدة بروفايلات مع معلومات سريعة عن كل حساب

### لوحة التحكم
عرض الإحصائيات والمنشورات الأخيرة

### المحتوى المعلق
إدارة المنشورات بانتظار الموافقة (قبول/رفض/حذف)

### الإعدادات
إدارة الأمان والتنبيهات وتسجيل الخروج

---

## ✨ المميزات الحالية

### المصادقة والأمان
- ✅ تسجيل دخول بـ اسم المستخدم وكلمة المرور
- ✅ نظام حماية للصفحات (Protected Routes)
- ✅ خيار الدخول السريع Biometric
- ✅ تخزين آمن للبيانات

### إدارة البروفايلات
- ✅ دعم بروفايلات متعددة
- ✅ عرض معلومات البروفايل
- ✅ تبديل سهل بين البروفايلات

### لوحة التحكم
- ✅ عرض الإحصائيات الأساسية
- ✅ عرض آخر المنشورات
- ✅ حالات المنشورات (منشور/مجدول/مسودة)

### المحتوى المعلق
- ✅ عرض المنشورات بانتظار الموافقة
- ✅ إجراءات (قبول/رفض/حذف)
- ✅ معلومات التاريخ والوقت

### الإعدادات
- ✅ إدارة Biometric
- ✅ تغيير كلمة المرور
- ✅ التحكم بالتنبيهات
- ✅ تسجيل خروج

### الواجهة والتصميم
- ✅ Dark Mode و Light Mode
- ✅ تنقل سفلي (3 أزرار فقط)
- ✅ زر التنبيهات في الأعلى
- ✅ Design بسيط وأنيق
- ✅ Responsive على جميع الأجهزة

---

## 🛠️ التقنيات المستخدمة

### Frontend Framework
- **Next.js 14** - React framework حديث مع SSR
- **React 18** - مكتبة UI قوية
- **TypeScript** - لغة برمجة آمنة

### Styling
- **Tailwind CSS** - utility-first CSS framework
- **CSS-in-JS** - أنماط ديناميكية

### State Management
- **Zustand** - مدير حالة خفيف الوزن

### Form Handling
- **React Hook Form** - إدارة نماذج فعالة
- **Zod** - validation schemas

### Icons & Animation
- **Lucide Icons** - أيقونات جميلة
- **Framer Motion** - رسوميات متحركة

### Developer Tools
- **ESLint** - code linting
- **Prettier** - code formatting
- **TypeScript** - type checking

---

## 📁 هيكل المشروع

```
nomo/
├── web/                       # Frontend (Next.js)
│   ├── app/
│   │   ├── app/              # صفحات مُحمية
│   │   ├── login/            # صفحة الدخول
│   │   ├── profiles/         # اختيار البروفايل
│   │   └── layout.tsx        # Root layout
│   ├── components/           # مكونات React
│   ├── store/                # إدارة الحالة
│   ├── types/                # TypeScript types
│   ├── styles/               # Global styles
│   └── package.json
├── backend/                  # Backend (قريباً)
└── docs/                     # التوثيق
```

---

## 🔄 خارطة الطريق

### المرحلة 1: تحسينات Frontend 🎨
- تحسين validation الاستمارات
- إضافة رسوميات متحركة
- تحسين responsive design

### المرحلة 2: ميزات جديدة ✨
- شاشة إنشاء منشور
- توليد محتوى بـ AI
- جدولة المنشورات
- منشئ السلايدات

### المرحلة 3: Backend و API 🔌
- بناء الـ REST API
- تكامل قاعدة البيانات
- المصادقة المتقدمة

### المرحلة 4: الإطلاق 🚀
- PWA كامل
- نسخة iOS و Android
- دعم offline
- النشر على الإنتاج

---

## 📖 الدليل والتوثيق

انظر إلى [SETUP.md](./SETUP.md) للحصول على دليل تفصيلي للإعداد والتشغيل.

---

## 🐛 الإبلاغ عن الأخطاء

هل وجدت bug؟ يمكنك:
1. فتح issue على GitHub
2. وصف المشكلة بالتفصيل
3. إرسال صورة أو screenshot إن أمكن

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. كتابة كود نظيف
4. Commit بر messages واضحة
5. Push و فتح Pull Request

---

## 📝 ملاحظات التطوير

### معايير الكود
- TypeScript strict mode ✅
- ESLint configuration ✅
- Prettier formatting ✅
- Component-based architecture ✅

### Best Practices
- Reusable components
- Type-safe development
- DRY (Don't Repeat Yourself)
- Clean code principles

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](./LICENSE)

---

## 👤 الفريق

**تم بناؤه بـ:** ❤️ من قبل فريق نمو

---

## 💬 التواصل والدعم

- 📧 البريد الإلكتروني: [aff6252@gmail.com](mailto:aff6252@gmail.com)
- 💬 أسئلة؟ أفتح issue جديد

---

## 🙏 شكر وتقدير

شكر خاص لـ:
- فريق Next.js و React
- مجتمع Tailwind CSS
- كل المساهمين

---

**هل أعجبك المشروع؟ أضف ⭐ star على GitHub!**

---

<div align="center">

### 🌱 نمو - حيث تنمو حساباتك

**Made with ❤️ by Nomo Team**

[الموقع الرسمي](https://nomo.app) • [التوثيق](./SETUP.md) • [GitHub](https://github.com)

</div>
