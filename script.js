/* =========================
   script.js
   - Smooth scroll for in-page links
   - Simple "reveal on scroll" animation using IntersectionObserver
   - خفيف وسهل التعديل
   ========================= */

/* ======== مساعدة: اختيار العناصر التي تُنقَل بسلاسة ======== */
(function () {
  'use strict';

  // Smooth scroll for internal anchor links (supports buttons/anchors)
  function enableSmoothScroll() {
    // نستخدم behavior: 'smooth' المدمج في المتصفح
    document.addEventListener('click', function (e) {
      const el = e.target.closest('a[href^="#"]');
      if (!el) return;
      const href = el.getAttribute('href');
      if (href === '#' || href === '#0') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // نستخدم scrollIntoView مع سلوك سلسّ
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // ضبط الفوكس للولوجية بعد التمرير
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        // إزالة tabindex بعد فترة قصيرة إن أردنا نظافة DOM
        window.setTimeout(() => target.removeAttribute('tabindex'), 1200);
      }
    });
  }

  /* ======== Reveal on scroll ========
     نستخدم IntersectionObserver لعمل تأثير Fade/Slide بسيط
     خفيف الأداء بالمقارنة مع أحداث التمرير التقليدية
  */
  function enableRevealOnScroll() {
    // إذا لم يدعم المتصفح الاختبار، نجعل العناصر مرئية فوراً
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.anim').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // نوقف المراقبة بعد الظهور لتوفير الأداء
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

  // تنفيذ التهيئة بعد تحميل DOM
  document.addEventListener('DOMContentLoaded', function () {
    enableSmoothScroll();
    enableRevealOnScroll();

    // تحسّن تجربة الوصول: تمييز عند التركيز عبر لوحة المفاتيح
    document.body.addEventListener('keyup', function (e) {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('user-is-tabbing');
      }
    }, { once: true });
  });
})();