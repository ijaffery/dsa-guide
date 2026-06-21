// ─── Mobile nav toggle ───
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.site-nav').classList.toggle('open');
});
document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.site-nav').classList.remove('open');
  });
});

// ─── Scroll progress bar ───
const progressBar = document.getElementById('progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ─── Intersection Observer: highlight active nav link ───
const headings = document.querySelectorAll('h2[id]');
const navLinks = document.querySelectorAll('.nav-link');

if (headings.length && navLinks.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => observer.observe(h));
}

// ─── Restore h3 numbering (keeps numbers in heading text) ──
document.querySelectorAll('h3[data-num]').forEach(h3 => {
  const n = h3.getAttribute('data-num');
  const title = h3.textContent.trim();
  h3.textContent = n + '. ' + title;
});
document.querySelectorAll('h3').forEach(h3 => {
  const text = h3.textContent.trim();
  const match = text.match(/^(\d+)\./);
  if (match) {
    h3.setAttribute('data-num', match[1]);
    h3.textContent = text.replace(/^(\d+)\./, '');
  }
});

// ─── Smooth scroll for anchor links ───
const HEADER_OFFSET = 60; // match site-header height + buffer

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', link.getAttribute('href'));
    }
  });
});
