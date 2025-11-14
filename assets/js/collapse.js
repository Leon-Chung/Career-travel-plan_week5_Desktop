document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('navbarSupportedContent');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('is-open');
      menuBtn.classList.toggle('active');
    });
  }
});