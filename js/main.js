// ====================================================================
// GOOGLE ANALYTICS 4
// Cole o ID de medicao da propriedade GA4 abaixo (formato G-XXXXXXXXXX).
// Enquanto estiver com o placeholder, nada e carregado (sem erro).
const GA_ID = 'G-EM9E5N6JCL';
// ====================================================================

function initAnalytics() {
  if (!GA_ID || GA_ID.slice(0, 2) !== 'G-' || GA_ID === 'G-XXXXXXXXXX') return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

function trackEvent(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
}

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a:not(.btn-nav)').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });

  initAnalytics();

  // ── Rastreio de cliques (WhatsApp e e-mail) ──
  document.querySelectorAll('a[href*="wa.me"], a[href^="https://api.whatsapp"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('click_whatsapp', {
      page: page,
      link_text: (a.textContent || '').trim().slice(0, 60)
    }));
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
    a.addEventListener('click', () => trackEvent('click_email', { page: page }));
  });

  // ── Carrossel de depoimentos ──
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track || slides.length === 0) return;

    let index = 0;
    let timer;

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Ir para o depoimento ' + (i + 1));
      dot.addEventListener('click', () => { go(i); reset(); });
      dotsWrap && dotsWrap.appendChild(dot);
      return dot;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }

    function reset() {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), 7000);
    }

    prev && prev.addEventListener('click', () => { go(index - 1); reset(); });
    next && next.addEventListener('click', () => { go(index + 1); reset(); });
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', reset);

    go(0);
    reset();
  });
});
