/* ============================================
   ANIMATION AGENT - Scroll, Fade, Transitions
   ============================================ */

/* ---- Intersection Observer for scroll animations ---- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger children if grid
        const children = entry.target.querySelectorAll('.featured-card, .menu-card, .testimonial-card, .dash-card');
        children.forEach((child, i) => {
          child.style.animationDelay = `${i * 0.1}s`;
          child.style.opacity = '0';
          child.style.animation = `fadeInUp 0.5s ease ${i * 0.1}s forwards`;
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll, .reveal').forEach(el => observer.observe(el));
  return observer;
}

/* ---- Smooth scroll to element ---- */
function smoothScrollTo(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ---- Navbar scroll effect ---- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
}

/* ---- Notification System ---- */
let notificationTimeout;
function showNotification(message, type = 'success') {
  const notif = document.getElementById('notification');
  const text = document.getElementById('notification-text');
  const icon = document.getElementById('notification-icon');
  
  clearTimeout(notificationTimeout);
  notif.classList.remove('hidden');
  notif.className = 'notification ' + type;
  text.textContent = message;
  icon.innerHTML = type === 'success' ? '<i class="fa-solid fa-check"></i>' : type === 'error' ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-info-circle"></i>';
  notif.style.animation = 'none';
  void notif.offsetWidth;
  notif.style.animation = 'slideInRight 0.4s ease forwards';

  notificationTimeout = setTimeout(() => {
    notif.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => notif.classList.add('hidden'), 400);
  }, 3000);
}

function hideNotification() {
  const notif = document.getElementById('notification');
  notif.style.animation = 'slideOutRight 0.4s ease forwards';
  setTimeout(() => notif.classList.add('hidden'), 400);
}

/* ---- Cart badge bump ---- */
function bumpCartBadge() {
  const badge = document.getElementById('cart-count');
  badge.classList.remove('bump');
  void badge.offsetWidth; // reflow
  badge.classList.add('bump');
}

/* ---- Loading animation ---- */
function showLoader() {
  document.getElementById('loader').classList.remove('hide');
}

function hideLoader() {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1600);
}
