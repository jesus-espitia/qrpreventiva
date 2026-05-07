/**
 * ========================================
 * HOME.JS — Lógica de la landing page
 * Animaciones de scroll y efectos visuales
 * No contiene datos quemados
 * ========================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ========================================
     Header con sombra al hacer scroll
     ======================================== */
  var header = document.querySelector('.home-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================
     Animaciones al scroll (IntersectionObserver)
     ======================================== */
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            /* Respetar delay si existe */
            var delay = entry.target.dataset.animDelay;
            if (delay) {
              entry.target.style.transitionDelay = delay + 'ms';
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: mostrar todo si no hay soporte */
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ========================================
     Smooth scroll para links internos
     ======================================== */
  var internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

});