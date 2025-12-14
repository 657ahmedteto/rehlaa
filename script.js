/* =========================
   script.js
   - Smooth scroll for in-page links
   - Simple "reveal on scroll" animation using IntersectionObserver
   - WhatsApp CTA handler (يبني رابط مشفّر ويفتحه)
   - Theme toggle (dark/light) مع حفظ الاختيار في localStorage
   - خفيف ومشروح بالعربية
   ========================= */
(function () {
  'use strict';

  /* -------------------------
     Smooth scroll for internal anchors (hash links)
     ------------------------- */
  function enableSmoothScroll() {
    document.addEventListener('click', function (e) {
      const el = e.target.closest('a[href^="#"]');
      if (!el) return;
      const href = el.getAttribute('href');
      if (href === '#' || href === '#0') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        window.setTimeout(() => target.removeAttribute('tabindex'), 1200);
      }
    });
  }

  /* -------------------------
     Reveal on scroll (IntersectionObserver)
     ------------------------- */
  function enableRevealOnScroll() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.anim').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    });

    document.querySelectorAll('.anim').forEach((el) => observer.observe(el));
  }

  /* -------------------------
     WhatsApp CTA handler
     - العناصر ذات الصنف .wa-cta تحتوي خصائص:
       data-wa-number => رقم مع رمز البلد (+20...)
       data-wa-text   => نص الرسالة (غير مشفّر)
     - إذا ضغط المستخدم على الرابط، نبني الرابط الرسمي ونفتحه في تبويب جديد
     ------------------------- */
  function enableWhatsAppCTAs() {
    const waElements = document.querySelectorAll('.wa-cta');
    waElements.forEach((el) => {
      el.addEventListener('click', function (e) {
        // لو الرابط يشير لهاتف مباشر (fallback) أو نريد فتح في نافذة جديدة
        const number = el.getAttribute('data-wa-number') || '';
        const text = el.getAttribute('data-wa-text') || '';
        // إذا لم يوجد رقم، فندع السلوك الافتراضي (href)
        if (!number) return;
        e.preventDefault();
        // نزيل أي مسافات أو + لنبني رابط صالح
        const raw = number.replace(/\s+/g, '').replace(/^\+/, '');
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${raw}?text=${encoded}`;
        // فتح في تبويب جديد مع حماية (noopener)
        window.open(url, '_blank', 'noopener');
      });
    });
  }

  /* -------------------------
     Theme toggle (Light / Dark)
     - نخزن الاختيار في localStorage كـ 'theme' بقيمة 'dark' أو 'light'
     - عند التحميل، نقرأ القيمة أو نستخدم prefered-color-scheme
     ------------------------- */
  const THEME_KEY = 'theme-preference';

  function applyTheme(theme) {
    // theme = 'dark' | 'light'
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggleButton.setAttribute('aria-pressed', 'true');
      themeToggleButton.title = 'الوضع الداكن مفعل — اضغط للتبديل';
    } else {
      document.documentElement.classList.remove('dark');
      themeToggleButton.setAttribute('aria-pressed', 'false');
      themeToggleButton.title = 'الوضع الفاتح مفعل — اضغط للتبديل';
    }
  }

  function initThemeToggle() {
    // زر التبديل
    window.themeToggleButton = document.getElementById('theme-toggle');
    if (!themeToggleButton) return;

    // قراءة التفضيل من localStorage أو من إعدادات النظام
    const saved = localStorage.getItem(THEME_KEY);
    let initialTheme = 'light';
    if (saved === 'dark' || saved === 'light') {
      initialTheme = saved;
    } else {
      // استخدم prefer-color-scheme لو متوفر
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(initialTheme);

    // تعامل مع الضغط على الزر
    themeToggleButton.addEventListener('click', function () {
      const isDark = document.documentElement.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // تنفيذ التهيئة بعد تحميل DOM
  document.addEventListener('DOMContentLoaded', function () {
    enableSmoothScroll();
    enableRevealOnScroll();
    enableWhatsAppCTAs();
    initThemeToggle();

    // تحسّن تجربة الوصول: تمييز عند التركيز عبر لوحة المفاتيح
    document.body.addEventListener('keyup', function (e) {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing');
      }
    }, { once: true });
  });
})();
