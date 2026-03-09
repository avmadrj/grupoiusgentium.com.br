/**
 * Ius Gentium UFSC — Main Application Script
 * Handles: theme toggle, mobile nav, sticky header, active nav, scroll animations
 */

(function () {
  "use strict";

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  let currentTheme = matchMedia("(prefers-color-scheme:dark)").matches
    ? "dark"
    : "light";

  root.setAttribute("data-theme", currentTheme);
  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", currentTheme);
      updateThemeIcon();
    });
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    var label =
      currentTheme === "dark"
        ? "Alternar para modo claro"
        : "Alternar para modo escuro";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.innerHTML =
      currentTheme === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  var mobileToggle = document.querySelector("[data-mobile-toggle]");
  var mobileClose = document.querySelector("[data-mobile-close]");
  var mobileNav = document.getElementById("mobile-nav");

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", openMobileNav);
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobileNav);
  }

  // Close mobile nav when clicking a link
  if (mobileNav) {
    var mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  // ============================================================
  // STICKY HEADER — scroll state
  // ============================================================
  var header = document.querySelector(".header");
  var lastScrollY = 0;

  function handleScroll() {
    var scrollY = window.scrollY;

    if (header) {
      if (scrollY > 50) {
        header.classList.add("header--scrolled");
      } else {
        header.classList.remove("header--scrolled");
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ============================================================
  // ACTIVE NAV LINK — Intersection Observer
  // ============================================================
  var navLinks = document.querySelectorAll(".header__nav a");
  var sections = document.querySelectorAll("section[id]");

  if (sections.length > 0 && navLinks.length > 0) {
    var observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + id) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // ============================================================
  // SCROLL REVEAL — fallback for browsers without scroll-timeline
  // ============================================================
  if (!CSS.supports || !CSS.supports("animation-timeline: scroll()")) {
    var fadeElements = document.querySelectorAll(".fade-in");

    if (fadeElements.length > 0 && "IntersectionObserver" in window) {
      var fadeObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transition =
                "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );

      fadeElements.forEach(function (el) {
        el.style.opacity = "0";
        fadeObserver.observe(el);
      });
    }
  }

  // ============================================================
  // SMOOTH SCROLL — enhance native behavior
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // Update URL without triggering scroll
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
})();
