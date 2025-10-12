document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.querySelector('nav ul');

  menuToggle.addEventListener('click', () => {
    menuNav.classList.toggle('active');
  });
});
