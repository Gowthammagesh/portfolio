/* ============================================================
   M GOWTHAM — Portfolio Interactions
   ============================================================ */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;

  /* ---------- Preloader ---------- */
  var preloader = doc.getElementById("preloader");
  window.addEventListener("load", function () {
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add("hidden");
        body.classList.add("loaded");
      }, 350);
    }
  });
  setTimeout(function () {
    if (preloader && !body.classList.contains("loaded")) {
      preloader.classList.add("hidden");
      body.classList.add("loaded");
    }
  }, 3000);

  /* ---------- Navbar: scroll state ---------- */
  var navbar = doc.getElementById("navbar");
  var backToTop = doc.getElementById("backToTop");
  var scrollTimer = null;

  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    if (navbar) navbar.classList.toggle("scrolled", y > 24);
    if (backToTop) backToTop.classList.toggle("visible", y > 600);
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      setActiveNav();
    }, 90);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = doc.getElementById("navToggle");
  var navMenu = doc.getElementById("navMenu");

  function closeMenu() {
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("open");
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = doc.querySelectorAll("section[id]");
  var navLinks = doc.querySelectorAll(".nav-link");

  function setActiveNav() {
    var pos = (window.pageYOffset || doc.documentElement.scrollTop) + 140;
    var currentId = "";
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.getAttribute("id");
    });
    if (!currentId) currentId = "home";
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }

  /* ---------- Close menu on link click ---------- */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (navMenu.classList.contains("open")) closeMenu();
    });
  });

  /* ---------- Smooth scroll for anchor links (native fallback safe) ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = doc.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll(".reveal");
  var io = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;

  revealEls.forEach(function (el) {
    if (io) io.observe(el);
    else el.classList.add("in-view");
  });

  /* ---------- Contact form (front-end validation + mailto fallback) ---------- */
  var form = doc.getElementById("contactForm");
  var formNote = doc.getElementById("formNote");
  var sendBtn = doc.getElementById("sendBtn");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = doc.getElementById("name");
      var email = doc.getElementById("email");
      var subject = doc.getElementById("subject");
      var message = doc.getElementById("message");
      var valid = true;

      var fields = [
        { el: name, ok: name.value.trim().length > 1 },
        { el: email, ok: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) },
        { el: subject, ok: subject.value.trim().length > 1 },
        { el: message, ok: message.value.trim().length > 5 }
      ];

      fields.forEach(function (f) {
        f.el.classList.toggle("invalid", !f.ok);
        if (!f.ok) valid = false;
      });

      if (!valid) {
        formNote.textContent = "Please fill in all fields correctly.";
        formNote.className = "form-note error";
        return;
      }

      var bodyText =
        "Name: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n" +
        "Subject: " + subject.value.trim() + "\n\n" +
        message.value.trim();

      var mailto = "mailto:gowthamgowtham5081@gmail.com" +
        "?subject=" + encodeURIComponent(subject.value.trim()) +
        "&body=" + encodeURIComponent(bodyText);

      var original = sendBtn.innerHTML;
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";

      formNote.textContent = "Opening your email app to send this message...";
      formNote.className = "form-note success";
      setTimeout(function () {
        window.location.href = mailto;
        form.reset();
        sendBtn.disabled = false;
        sendBtn.innerHTML = original;
        setTimeout(function () {
          formNote.innerHTML = "Thank you! Your message is ready to be sent. I'll get back to you soon.";
        }, 400);
      }, 600);
    });

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.classList.remove("invalid");
        formNote.className = "form-note";
        formNote.textContent = "";
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Subtle pointer glow (desktop, cheap) ---------- */
  var glowOk = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (glowOk) {
    var cursorDot = doc.createElement("div");
    cursorDot.className = "cursor-glow";
    doc.body.appendChild(cursorDot);
    var rafPending = false;
    doc.addEventListener("pointermove", function (e) {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        cursorDot.style.transform =
          "translate(" + (e.clientX - 160) + "px," + (e.clientY - 160) + "px)";
        rafPending = false;
      });
    }, { passive: true });
  }
})();