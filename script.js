/* ===========================================================
   kaupankylmalaitteet.fi — Shared JavaScript
   Mobile nav, carousel, lightbox, contact form, GA4 tracking
   =========================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile Nav Toggle ----
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
    });
    // Close nav when a link is clicked (mobile UX)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ---- Carousels ----
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var current = 0;
    var total = slides.length;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(current - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      goTo(current + 1);
    });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(i);
      });
    });
  });

  // ---- Lightbox ----
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  var lightboxImages = [];
  var lightboxIndex = 0;

  function updateLightbox() {
    if (!lightboxImg || lightboxImages.length === 0) return;
    var img = lightboxImages[lightboxIndex];
    lightboxImg.setAttribute('src', img.src);
    lightboxImg.setAttribute('alt', img.alt);
    if (lightboxPrev) lightboxPrev.style.display = lightboxImages.length > 1 ? '' : 'none';
    if (lightboxNext) lightboxNext.style.display = lightboxImages.length > 1 ? '' : 'none';
  }

  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    slides.forEach(function (slide, index) {
      slide.addEventListener('click', function () {
        var imgs = carousel.querySelectorAll('.carousel-slide img');
        lightboxImages = Array.from(imgs).map(function (img) {
          return { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
        });
        lightboxIndex = index;
        updateLightbox();
        if (lightbox) lightbox.classList.add('open');
      });
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightbox();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', function (e) {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  }

  // ---- Contact Form Modal ----
  // NOTE: Wire up form submission to your backend or a service like Formspree.
  var formModal = document.getElementById('formModal');
  var contactForm = document.getElementById('contactForm');
  var formHTML = contactForm ? contactForm.innerHTML : '';

  // Open form — any element with class "contact-trigger"
  document.querySelectorAll('.contact-trigger').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (formModal) formModal.classList.add('open');
    });
  });

  // Close form (overlay, close button)
  if (formModal) {
    formModal.addEventListener('click', function (e) {
      if (e.target === formModal || e.target.classList.contains('form-modal-overlay') || e.target.classList.contains('form-modal-close')) {
        formModal.classList.remove('open');
      }
    });
  }

  // Escape key closes form + lightbox
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (formModal) formModal.classList.remove('open');
      if (lightbox) lightbox.classList.remove('open');
    }
  });

  // Form submit
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // GA4: track form submission
      if (typeof gtag === 'function') {
        gtag('event', 'submit_contact_form', {
          event_category: 'CTA',
          event_label: 'contact_form'
        });
      }
      // TODO: Send form data to Formspree / your backend here
      // Show success message
      contactForm.innerHTML = '<div class="form-success">\u2713 Kiitos! Otamme sinuun yhteytt\u00e4 pian.</div>';
      setTimeout(function () {
        if (formModal) formModal.classList.remove('open');
        setTimeout(function () { contactForm.innerHTML = formHTML; }, 300);
      }, 2500);
    });
  }

  // ---- GA4 Event Tracking ----
  // Phone number clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'click_phone', {
          event_category: 'CTA',
          event_label: el.getAttribute('href')
        });
      }
    });
  });

  // Email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'click_email', {
          event_category: 'CTA',
          event_label: el.getAttribute('href')
        });
      }
    });
  });

  // Contact form open clicks
  document.querySelectorAll('.contact-trigger').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'open_contact_form', {
          event_category: 'CTA',
          event_label: 'contact_form_open'
        });
      }
    });
  });

  // ---- Active Nav Link ----
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
