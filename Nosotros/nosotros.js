  window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    
    if (window.scrollY > 10) {
      // Cuando el usuario baja
      header.classList.remove("transparent");
    } else {
      // Cuando está arriba del todo
      header.classList.add("transparent");
    }
  });

  // Estado inicial al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (window.scrollY <= 10) {
      header.classList.add("transparent");
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.querySelector('nav ul');

  menuToggle.addEventListener('click', () => {
    menuNav.classList.toggle('active');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const anchors = document.querySelectorAll('a[href]');
  anchors.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const isExternal = /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    if (isExternal) {
      a.setAttribute('target', '_blank');
      const rel = (a.getAttribute('rel') || '').trim();
      const parts = new Set(rel.split(/\s+/).filter(Boolean));
      parts.add('noopener');
      parts.add('noreferrer');
      a.setAttribute('rel', Array.from(parts).join(' '));
    }
  });
});
