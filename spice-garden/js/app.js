/* ============================================
   MAIN APP - Router, Theme, Init
   ============================================ */

/* ---- SPA Router ---- */
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    // Retrigger page animation
    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = 'pageIn 0.5s ease forwards';
  }

  // Update nav active link
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Update URL hash
  history.pushState(null, '', `#${page}`);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile menu
  document.getElementById('nav-links').classList.remove('open');
  document.getElementById('hamburger').classList.remove('active');

  // Show/hide footer (hidden on admin page)
  const footer = document.getElementById('site-footer');
  if (footer) footer.style.display = page === 'admin' ? 'none' : 'block';

  // Page-specific init
  if (page === 'menu') renderMenu();
  if (page === 'order') renderCart();
  if (page === 'admin') {
    if (!isAdmin()) {
      showNotification('Admin access required. Login as admin.', 'error');
      navigateTo('login');
      return;
    }
    renderDashboard();
  }
  if (page === 'payment') renderPaymentSummary();

  // Re-init scroll animations
  setTimeout(() => initScrollAnimations(), 100);
}

/* ---- Hash Router ---- */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
}

/* ---- Theme Toggle ---- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('sg_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  icon.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    icon.innerHTML = next === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('sg_theme', next);
  });
}

/* ---- Hamburger Menu ---- */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ---- Contact Form ---- */
function submitContactForm(e) {
  e.preventDefault();
  showNotification('Thank you! Your message has been sent.', 'success');
  document.getElementById('contact-form').reset();
  return false;
}

/* ---- Card Number Formatting ---- */
function initCardFormatting() {
  const cardInput = document.getElementById('card-number');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      v = v.replace(/(\d{4})/g, '$1 ').trim();
      e.target.value = v;
    });
  }
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
      e.target.value = v;
    });
  }
}

/* ---- Init App ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Show loader
  hideLoader();

  // Init features
  initThemeToggle();
  initHamburger();
  initNavbarScroll();
  initCardFormatting();
  updateAuthUI();
  updateCartCount();
  renderFeatured();

  // Handle initial route
  setTimeout(() => {
    handleHashChange();
    initScrollAnimations();
  }, 200);

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Nav link click handlers
  document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      const page = link.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        navigateTo(page);
      }
    });
  });
});
