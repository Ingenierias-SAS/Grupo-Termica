
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



document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const menuNav = document.getElementById("menu-nav");

  menuToggle.addEventListener("click", () => {
    menuNav.querySelector("ul").classList.toggle("active");
  });
});
