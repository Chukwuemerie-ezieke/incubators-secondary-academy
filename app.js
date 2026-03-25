/* ============================================================
   Incubators Secondary Academy — App JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', 'Switch to ' + (currentTheme === 'dark' ? 'light' : 'dark') + ' mode');
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    if (currentTheme === 'dark') {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      themeToggle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  // ============================================================
  // HEADER SCROLL BEHAVIOR
  // ============================================================
  const header = document.getElementById('header');
  let lastScrollY = 0;

  // On inner pages (with page-hero, no full-bleed hero), always show scrolled header
  var hasFullHero = document.querySelector('.hero');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (!hasFullHero) {
      // Inner pages: always scrolled style
      header.classList.add('header--scrolled');
    } else if (scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('.mobile-nav__link') : [];

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mobileToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // SCROLL-BASED ANIMATIONS (IntersectionObserver)
  // ============================================================
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // PAGE-BASED ACTIVE NAV HIGHLIGHTING
  // ============================================================
  var pathSegment = window.location.pathname.split('/').pop() || '';
  // Normalize: strip .html extension for comparison
  var currentPage = pathSegment.replace(/\.html$/, '') || 'index';
  if (currentPage === '') currentPage = 'index';

  var navLinks = document.querySelectorAll('.nav__link');
  var mobileLinks = document.querySelectorAll('.mobile-nav__link');

  function setActiveLinks(links) {
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      // Normalize href: strip .html extension
      var hrefPage = href.replace(/\.html$/, '') || 'index';
      if (hrefPage === currentPage) {
        link.classList.add('active');
      }
    });
  }

  setActiveLinks(navLinks);
  setActiveLinks(mobileLinks);

  // ============================================================
  // CONTACT FORM (Decorative)
  // ============================================================
  const contactForm = document.getElementById('contactFormEl');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        return;
      }

      // Show success message
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');

      // Reset after 5 seconds
      setTimeout(function () {
        contactForm.style.display = '';
        formSuccess.classList.remove('show');
        contactForm.reset();
      }, 5000);
    });
  }

  // ============================================================
  // SMOOTH SCROLL FOR HASH LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // ============================================================
  // HERO STATS COUNTER ANIMATION
  // ============================================================
  const statValues = document.querySelectorAll('.hero__stat-value');

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window && statValues.length > 0) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statValues.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    if (statValues[0]) {
      statsObserver.observe(statValues[0].closest('.hero__stats'));
    }
  }

})();
