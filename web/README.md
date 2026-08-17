# 🌱 نمو - Nomo

تطبيق ويب متقدم (PWA) لإدارة جميع حسابات وسائل التواصل الاجتماعي من مكان واحد.

## ✨ المميزات

- ✅ إدارة عدة بروفايلات (حسابات وسائل تواصل)
- ✅ واجهة بسيطة وأنيقة باللون الأبيض والأسود
- ✅ Dark Mode و Light Mode
- ✅ دعم التنبيهات والإشعارات
- ✅ إدارة المحتوى المعلق (Pending Content)
- ✅ إحصائيات وتحليلات سريعة
- ✅ تصميم responsive يعمل على جميع الأجهزة
- ✅ Biometric authentication (Face ID / Touch ID)

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn

### التثبيت

```bash
# الانتقال للمشروع
cd web

# تثبيت المكتبات
npm install

# تشغيل خادم التطوير
npm run dev
```

ثم افتح `http://localhost:3000` في المتصفح.

### بيانات الدخول التجريبية
- **اسم المستخدم:** demo
- **كلمة المرور:** demo123

## 📁 بنية المشروع

```
web/
├── app/                    # Next.js app directory
│   ├── login/             # صفحة تسجيل الدخول
│   ├── profiles/          # اختيار البروفايل
│   └── app/
│       ├── dashboard/     # الصفحة الرئيسية
│       ├── pending/       # المحتوى المعلق
│       └── settings/      # الإعدادات
├── components/
│   └── common/            # مكونات قابلة لإعادة الاستخدام
├── store/                 # Zustand store
├── types/                 # TypeScript types
├── styles/                # Global styles
└── tailwind.config.ts     # Tailwind configuration
```

## 🎨 الألوان والتصميم

- **اللون الأساسي:** أسود (#000000)
- **اللون الثانوي:** أبيض (#FFFFFF)
- **اللون الخلفي:** رمادي فاتح (#F3F4F6)
- **Dark Mode:** دعم كامل

## 🔐 الأمان

- تحقق Biometric (Face ID / Touch ID)
- تخزين آمن للبيانات محلياً
- سيتم إضافة المزيد من ميزات الأمان

## 📱 الأجهزة المدعومة

- ✅ iOS (Apple devices)
- ✅ Android (Samsung & other devices)
- ✅ Web browsers

## 🔄 الخطوات التالية

- [ ] إضافة قدرات PWA كاملة
- [ ] توليد محتوى بواسطة AI
- [ ] جدولة المنشورات
- [ ] سلايدات Instagram
- [ ] تكامل Backend
- [ ] نشر التطبيق

## 📝 الملاحظات

هذا إصدار بيتا من التطبيق. المزيد من المميزات قيد التطوير.

---

**تم بناؤه بـ:** Next.js 14 | React 18 | TypeScript | Tailwind CSS | Zustand
