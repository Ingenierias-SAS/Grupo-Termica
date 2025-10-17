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
  const selects = document.querySelectorAll(".servicio-select");

  selects.forEach(select => {
    select.addEventListener("change", (e) => {
      const card = e.target.closest(".servicio-card");
      const info = card.querySelector(".servicio-info");
      const value = e.target.value;
      let texto = "";

      switch (value) {
        // ===== Laboratorio Clínico =====
        case "hematologia":
          texto = "Análisis completos de sangre, hemoglobina y glóbulos rojos para control general de salud.";
          break;
        case "bacteriologia":
          texto = "Estudios microbiológicos para detección de bacterias, hongos y agentes patógenos.";
          break;
        case "toxicologia":
          texto = "Pruebas toxicológicas para detección de sustancias químicas en organismos o materiales.";
          break;

        // ===== Manipulación de Alimentos =====
        case "capacitacion":
          texto = "Cursos certificados para manipuladores de alimentos, dictados por profesionales del sector.";
          break;
        case "certificado":
          texto = "Emisión de certificados para personal capacitado en normas de higiene y manipulación segura.";
          break;
        case "inspeccion":
          texto = "Visitas técnicas para verificación de buenas prácticas de manufactura e inocuidad alimentaria.";
          break;

        // ===== Control de Plagas =====
        case "fumigacion":
          texto = "Tratamientos químicos y biológicos para control de insectos voladores y rastreros.";
          break;
        case "desratizacion":
          texto = "Control profesional de roedores mediante métodos seguros y certificados.";
          break;
        case "sanitizacion":
          texto = "Servicios de sanitización ambiental y desinfección profunda con productos aprobados.";
          break;

        default:
          texto = "";
      }

      // Mostrar texto o limpiar
      if (texto) {
        info.innerHTML = `<p>${texto}</p>`;
        info.classList.add("mostrar");
      } else {
        info.classList.remove("mostrar");
        info.innerHTML = "";
      }
    });
  });
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
