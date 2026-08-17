# ⚡ البدء السريع - نمو

## 🚀 ابدأ بـ 3 خطوات فقط

### 1️⃣ التثبيت
```bash
cd web
npm install
```

### 2️⃣ التشغيل
```bash
npm run dev
```

### 3️⃣ الفتح
```
http://localhost:3000
```

---

## 🔐 بيانات الدخول

| المجال | القيمة |
|--------|--------|
| اسم المستخدم | `demo` |
| كلمة المرور | `demo123` |

---

## 📍 الملاحة

### الصفحات الرئيسية
- `/login` - تسجيل الدخول
- `/profiles` - اختيار البروفايل
- `/app/dashboard` - لوحة التحكم
- `/app/pending` - المحتوى المعلق
- `/app/settings` - الإعدادات

---

## 🎮 الأوامر المتاحة

```bash
npm run dev      # تطوير (يعيد التحميل تلقائياً)
npm run build    # بناء للإنتاج
npm run start    # تشغيل الإصدار المبني
npm run lint     # التحقق من الكود
```

---

## 📱 ما تراه في التطبيق

### الشاشات الخمس
1. 🔐 **Login** - تسجيل دخول آمن
2. 👥 **Profiles** - تحديد الحساب
3. 🏠 **Dashboard** - عرض الإحصائيات
4. ⏳ **Pending** - المنشورات المعلقة
5. ⚙️ **Settings** - الإعدادات والأمان

### الميزات الرئيسية
- ✅ Dark/Light Mode (اضغط على الشمس/القمر)
- ✅ التنبيهات (الجرس في الأعلى)
- ✅ تنقل سفلي (3 أزرار)
- ✅ Responsive design
- ✅ Protected pages

---

## 🛠️ الملفات المهمة

| الملف | الغرض |
|------|-------|
| `app/layout.tsx` | Root layout |
| `app/login/page.tsx` | تسجيل الدخول |
| `store/index.ts` | إدارة الحالة |
| `components/common/` | المكونات المشتركة |
| `tailwind.config.ts` | الألوان والتنسيق |

---

## 🎨 تخصيص الألوان

اذهب إلى `tailwind.config.ts`:
```typescript
colors: {
  primary: '#000000',    // اللون الأساسي
  secondary: '#FFFFFF',  // اللون الثانوي
}
```

---

## 🆘 حل المشاكل

### لا يعمل؟
```bash
# امسح الذاكرة
rm -rf node_modules .next
npm install
npm run dev
```

### خطأ في Tailwind؟
- تحقق من `tailwind.config.ts`
- أعد تشغيل `npm run dev`

### لا تظهر التغييرات؟
- اضغط `Ctrl+Shift+Delete` لمسح الـ cache
- أعد تحميل الصفحة بـ `Ctrl+R`

---

## 📚 مراجع إضافية

- [README.md](./README.md) - نظرة عامة
- [FEATURES.md](./FEATURES.md) - شرح الميزات
- [SETUP.md](./SETUP.md) - دليل التثبيت الكامل
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - حالة المشروع

---

## ✨ الخطوات التالية

1. استكشف الصفحات المختلفة
2. جرّب Dark Mode
3. اختبر الملاحة
4. اقرأ الكود للفهم

---

## 💡 نصيحة سريعة

استخدم browser devtools (F12) لفحص الكود وحل المشاكل!

---

<div align="center">

### 🎉 استمتع بـ نمو!

**أي مشكلة؟ اطلب مساعدة!**

</div>
