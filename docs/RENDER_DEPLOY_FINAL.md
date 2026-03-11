# النشر على Render – النسخة النهائية

## سبب الخطأ السابق

- **Cannot find module 'expo/AppEntry.js'**: Render يشغّل افتراضياً `node expo/AppEntry.js` (من حقل `main` في package.json)، والملف لم يكن موجوداً في المشروع (موجود فقط داخل `node_modules/expo`).
- الحل: إضافة **expo/AppEntry.js** في جذر المشروع ليحمّل الخادم الثابت (server.js) عند التشغيل على Render، مع جعل بناء الويب يستخدم **expo/AppEntry.web.js** فقط حتى لا يُضمَّن كود الخادم في الحزمة.

---

## الملفات المُعدَّلة / المُضافة

| الملف | التعديل |
|-------|---------|
| **expo/AppEntry.js** | نقطة دخول Node (Render): يستدعي `serverBootstrap.js` لبدء الخادم. |
| **expo/AppEntry.web.js** | نقطة دخول ويب فقط: تسجيل التطبيق (لا خادم). |
| **expo/serverBootstrap.js** | يستدعي `server.js` عبر مسار ديناميكي (لا يُضمَّن في حزمة الويب). |
| **metro.config.js** | `resolveRequest`: عند منصة `web` يحوّل طلب `expo/AppEntry.js` إلى `expo/AppEntry.web.js`. |
| **package.json** | إضافة سكربت `start:render`: `node expo/AppEntry.js`. |
| **render.yaml** | `buildCommand`: `npm install && npm run build`، `startCommand`: `node expo/AppEntry.js`. |
| **.nvmrc** | Node 20. |
| **server.js** | فحص وجود `dist` و`index.html` عند البدء، ومعالجة أخطاء الخادم. |
| **scripts/start.js** | في الإنتاج مع وجود `dist`: تشغيل server.js؛ وإلا تشغيل Expo. |
| **RENDER_SETUP.txt** | تذكير بأمر البناء وأمر التشغيل. |
| **docs/DEPLOY_RENDER.md** | تحديث تعليمات النشر. |

---

## أوامر التشغيل والبناء

| الأمر | الاستخدام |
|--------|-----------|
| `npm install` | تثبيت التبعيات. |
| `npm run build` | بناء الويب → مخرجات في `dist`. |
| `npm start` | محلياً: Expo؛ على Render (مع وجود `dist`): خادم ثابت. |
| `npm run start:render` | تشغيل `node expo/AppEntry.js` (مثل Render). |

---

## إعداد Render

1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `node expo/AppEntry.js` (أو الافتراضي إن كان نفسه).
3. **Node:** 20 (من `.nvmrc`).
4. **متغيرات البيئة (اختياري):** `EXPO_PUBLIC_API_URL`، `NODE_ENV=production` (غالباً مضبوط تلقائياً).

بعد الرفع والتشغيل، إن لم يُطبَّق `render.yaml` تلقائياً، اضبط **Build Command** يدوياً في لوحة Render على الأقل.
