/* ============================================================
   EYEConic 2026 — Shared JavaScript
   Navigation, animations, registration (direct), login, dashboard
   ============================================================ */

(function () {
  'use strict';

  // ---- Configuration ----
  const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycby9oJakpKU62ZPIrYaRH_y-NL36fQe9r-SSAqAqwIuc3PWTU6f0_7hAh50ikzSxtVYlAg/exec',   // EYEConic Apps Script URL
    ANIMATION_THRESHOLD: 0.15,
    TOAST_DURATION: 4000,
    LOADER_DELAY: 600
  };

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    loadComponent('nav-placeholder', 'nav.html', initNavigation);
    loadComponent('footer-placeholder', 'footer.html');
    initScrollAnimations();
    initSmoothScroll();
    initBackToTop();
    initLoader();
  }

  // ============================================================
  // COMPONENT LOADER
  // ============================================================
  function loadComponent(placeholderId, file, callback) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    fetch(file + '?v=' + Date.now())
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
        if (callback) callback();
        highlightActiveNav();
      })
      .catch(err => console.warn('Failed to load ' + file + ':', err));
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const mobile = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.nav-overlay');
    const navbar = document.querySelector('.navbar');

    function closeMenu() {
      if (toggle) toggle.classList.remove('active');
      if (mobile) mobile.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        if (mobile.classList.contains('open')) {
          closeMenu();
        } else {
          toggle.classList.add('active');
          mobile.classList.add('open');
          if (overlay) overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
      mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      if (overlay) overlay.addEventListener('click', closeMenu);
    }

    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }
  }

  function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) link.classList.add('active');
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.ANIMATION_THRESHOLD });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach(el => observer.observe(el));
    }, 500);
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
      }
    });
  }

  // ============================================================
  // BACK TO TOP
  // ============================================================
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============================================================
  // PAGE LOADER
  // ============================================================
  function initLoader() {
    const loader = document.querySelector('.loader-overlay');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, CONFIG.LOADER_DELAY);
    });
  }

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================
  window.showToast = function (message, type) {
    type = type || 'success';
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<span class="toast-message">' + message + '</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, CONFIG.TOAST_DURATION);
  };

  // ============================================================
  // REGISTRATION — DIRECT (No Payment)
  // ============================================================
  window.submitRegistration = function () {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const institution = document.getElementById('reg-institution').value.trim();
    const city = document.getElementById('reg-city').value.trim();
    const designation = document.getElementById('reg-designation').value.trim();
    const pass = document.getElementById('reg-password').value.trim();
    const food = document.getElementById('reg-food').value;
    const category = document.getElementById('reg-delegate-type').value;

    if (!name || !email || !phone || !institution || !city || !designation || !pass) {
      return showToast('Please fill all required fields.', 'error');
    }
    if (!category) {
      return showToast('Please select a delegate category.', 'error');
    }
    if (!food) {
      return showToast('Please select food preference.', 'error');
    }
    if (pass.length < 6) {
      return showToast('Password must be at least 6 characters.', 'error');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showToast('Please enter a valid email address.', 'error');
    }

    registerBackend(category);
  };

  function registerBackend(regType) {
    const btn = document.getElementById('reg-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Registering...'; }

    const data = {
      action: 'register',
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      phone: document.getElementById('reg-phone').value.trim(),
      institution: document.getElementById('reg-institution').value.trim(),
      city: document.getElementById('reg-city').value.trim(),
      designation: document.getElementById('reg-designation').value.trim(),
      password: document.getElementById('reg-password').value.trim(),
      delegateType: document.getElementById('reg-delegate-type').value,
      foodPreference: document.getElementById('reg-food').value,
      hasGala: false,
      regType: regType,
      amount: 0,
      paymentId: 'N/A'
    };

    const sendRequest = function (retryCount) {
      fetch(CONFIG.API_URL, { method: 'POST', body: JSON.stringify(data) })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        })
        .then(function (result) {
          if (btn) { btn.disabled = false; btn.textContent = 'Register'; }
          if (result.success) {
            showToast('Registration Successful! Check your email for confirmation.', 'success');
            setTimeout(function () { window.location.href = 'login.html'; }, 2000);
          } else {
            showToast('Error: ' + (result.message || 'Registration failed'), 'error');
          }
        })
        .catch(function (error) {
          if (retryCount < 1) {
            setTimeout(function () { sendRequest(retryCount + 1); }, 2000);
          } else {
            if (btn) { btn.disabled = false; btn.textContent = 'Register'; }
            showToast('Server Error. Please try again or contact support.', 'error');
          }
        });
    };
    sendRequest(0);
  }

  // ============================================================
  // LOGIN
  // ============================================================
  window.loginUser = function () {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!email || !password) return showToast('Please fill all fields.', 'error');

    const btn = document.getElementById('login-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Logging in...'; }

    fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email: email, password: password })
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        if (result.success) {
          localStorage.setItem('eyeconic_session', JSON.stringify(result));
          showToast('Login successful!', 'success');
          setTimeout(function () { window.location.href = 'dashboard.html'; }, 800);
        } else {
          showToast(result.message || 'Invalid credentials.', 'error');
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        showToast('Network error. Please try again.', 'error');
      });
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  window.logout = function () {
    localStorage.removeItem('eyeconic_session');
    showToast('Logged out successfully.', 'success');
    setTimeout(function () { window.location.href = 'index.html'; }, 500);
  };

  // ============================================================
  // PROGRAM TABS
  // ============================================================
  window.initProgramTabs = function () {
    const tabs = document.querySelectorAll('.tab-btn');
    const timelines = document.querySelectorAll('.program-timeline');
    if (tabs.length === 0) return;
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        timelines.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var day = tab.getAttribute('data-day');
        var target = document.querySelector('.program-timeline[data-day="' + day + '"]');
        if (target) target.classList.add('active');
      });
    });
  };

  // Expose config
  window.EYECONIC_CONFIG = CONFIG;

})();

// Init program tabs after DOM loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { if (typeof initProgramTabs === 'function') initProgramTabs(); });
} else {
  if (typeof initProgramTabs === 'function') initProgramTabs();
}
