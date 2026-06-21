// ─── Simple bookmark: auto-resume from last session ───
(function () {
  'use strict';

  const STORAGE_KEY = 'dsa-guide-bookmark';
  const HEADER_OFFSET = 60;

  // Save a bookmark to localStorage
  function saveBookmark(anchor) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ anchor, ts: Date.now() }));
    } catch (_) { /* storage full or private mode — ignore */ }
  }

  // Clear the bookmark
  function clearBookmark() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Load the last bookmark from localStorage
  function loadBookmark() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const { anchor, ts } = JSON.parse(raw);
      // Auto-expire after 24 hours
      if (Date.now() - ts > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return anchor;
    } catch (_) { return null; }
  }

  // Scroll to an anchor with header offset
  function scrollTo(anchor) {
    const el = document.getElementById(anchor);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Brief highlight flash on a heading
  function flashHeading(anchor) {
    var el = document.getElementById(anchor);
    if (!el) return;
    el.style.transition = 'box-shadow .6s ease';
    el.style.boxShadow = '0 0 0 2px var(--accent)';
    setTimeout(function () {
      el.style.boxShadow = '0 0 0 2px transparent';
    }, 600);
  }

  // Add a star marker to a heading
  function addStar(anchor) {
    // Remove all existing stars first
    document.querySelectorAll('.resume-marker').forEach(function (m) {
      m.remove();
    });
    var el = document.getElementById(anchor);
    if (!el) return;
    var star = document.createElement('span');
    star.className = 'resume-marker';
    star.textContent = '\u2b50';
    star.style.cssText = 'margin-left:.5rem;font-size:.75rem;vertical-align:middle;opacity:.8;';
    el.appendChild(star);
  }

  // Check if a heading already has the star marker
  function hasStar(anchor) {
    var el = document.getElementById(anchor);
    if (!el) return false;
    return el.querySelector('.resume-marker') !== null;
  }

  // Create a floating "Resume" button
  function createResumeBtn(anchor) {
    const heading = document.getElementById(anchor);
    const title = heading ? heading.textContent.trim() : anchor;

    const btn = document.createElement('button');
    btn.className = 'resume-btn';
    btn.innerHTML = '&#x1f4d6; Continue reading: ' + title;
    btn.addEventListener('click', function () {
      scrollTo(anchor);
    });

    const close = document.createElement('span');
    close.className = 'resume-close';
    close.innerHTML = '&times;';
    close.addEventListener('click', function () {
      btn.style.display = 'none';
      clearBookmark();
      // Also remove the star from the page
      var marker = document.querySelector('.resume-marker');
      if (marker) marker.remove();
    });

    btn.appendChild(close);
    return btn;
  }

  // Toggle bookmark on a topic
  function toggleBookmark(anchor) {
    var current = loadBookmark();
    if (current === anchor) {
      // Already bookmarked — remove it
      clearBookmark();
      var marker = document.querySelector('.resume-marker');
      if (marker) marker.remove();
    } else {
      // Not bookmarked — save it
      saveBookmark(anchor);
      addStar(anchor);
      flashHeading(anchor);
    }
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function () {
    // 1. If URL has a hash (user bookmarked/shared a URL), scroll to it
    const hash = location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      setTimeout(function () { scrollTo(hash); }, 100);
    }

    // 2. If there's a saved bookmark from a previous session, show resume button
    const lastBookmark = loadBookmark();
    if (lastBookmark && lastBookmark !== hash) {
      // Add star marker so user can see where they left off
      addStar(lastBookmark);

      var btn = createResumeBtn(lastBookmark);
      document.body.appendChild(btn);
    }

    // 3. On every nav link click, toggle the bookmark
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var id = link.getAttribute('href').slice(1);
        if (id) toggleBookmark(id);
      });
    });

    // 4. On any h3 heading click, toggle the bookmark
    document.querySelectorAll('h3[id]').forEach(function (h3) {
      h3.style.cursor = 'pointer';
      h3.addEventListener('click', function () {
        toggleBookmark(h3.id);
      });
    });
  });
})();
