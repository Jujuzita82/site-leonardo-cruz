document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a:not(.btn-nav)').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
});
