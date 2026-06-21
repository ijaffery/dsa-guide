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

  // Update the header bookmark icon
  function updateHeaderIcon(anchor) {
    var icon = document.getElementById('bookmark-header-icon');
    if (!icon) return;

    var heading = document.getElementById(anchor);
    var title = heading ? heading.textContent.trim() : anchor;

    if (anchor) {
      icon.style.display = 'inline';
      icon.title = 'Click to go to: ' + title;
      icon.textContent = '\ud83d\udd16';
      icon.style.opacity = '1';
    } else {
      icon.style.display = 'none';
      icon.title = '';
      icon.style.opacity = '.8';
    }
  }

  // Toggle bookmark on a topic
  function toggleBookmark(anchor) {
    var current = loadBookmark();
    if (current === anchor) {
      // Same topic clicked again — remove it
      clearBookmark();
      var marker = document.querySelector('.resume-marker');
      if (marker) marker.remove();
      updateHeaderIcon(null);
    } else {
      // Different topic — move bookmark
      saveBookmark(anchor);
      addStar(anchor);
      flashHeading(anchor);
      updateHeaderIcon(anchor);
    }
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', function () {
    // 1. If URL has a hash (user bookmarked/shared a URL), scroll to it
    const hash = location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      setTimeout(function () { scrollTo(hash); }, 100);
    }

    // 2. If there's a saved bookmark from a previous session
    const lastBookmark = loadBookmark();
    if (lastBookmark) {
      // Add star marker so user can see where they left off
      addStar(lastBookmark);
      // Show header icon
      updateHeaderIcon(lastBookmark);
    }

    // Header icon click → scroll to CURRENT bookmark (reads from storage each time)
    var headerIcon = document.getElementById('bookmark-header-icon');
    if (headerIcon) {
      headerIcon.addEventListener('click', function (e) {
        e.preventDefault();
        var currentBookmark = loadBookmark();
        if (currentBookmark) scrollTo(currentBookmark);
      });
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
