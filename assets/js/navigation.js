// Mobile nav toggle
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  document.querySelector('.site-nav').classList.toggle('open');
});

// Close mobile nav when a link is clicked
document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.site-nav').classList.remove('open');
  });
});

// Smooth scroll + update active nav link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', link.getAttribute('href'));
    }
  });
});
