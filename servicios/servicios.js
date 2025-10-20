let cotizacion = [];

function agregarCotizacion(servicio) {
  if (!cotizacion.includes(servicio)) {
    cotizacion.push(servicio);
    actualizarLista();
  }
}

function actualizarLista() {
  const lista = document.getElementById("lista-cotizacion");
  lista.innerHTML = "";
  cotizacion.forEach((serv, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${serv}`;
    lista.appendChild(li);
  });
}

function descargarPDF() {
  const JsPDFCtor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
  if (!JsPDFCtor) {
    alert("Error: jsPDF no se cargó correctamente.");
    return;
  }

  const doc = new JsPDFCtor();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 25;

  // ===== ENCABEZADO =====
  doc.setFillColor(24, 38, 108);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("KOLBING INGENIERÍA S.A.S.", 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("NIT: 901.917.444-1", 15, 30);
  doc.text("www.kolbingingenieria.com | gerenciakolbing@gmail.com", 100, 30);

  // ===== TÍTULO =====
  y = 55;
  doc.setTextColor(24, 38, 108);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COTIZACIÓN DE SERVICIOS", 15, y);

  const fecha = new Date().toLocaleDateString();
  const numCotizacion = Math.floor(1000 + Math.random() * 9000);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Fecha: ${fecha}`, pageWidth - 70, y);
  doc.text(`No. Cotización: ${numCotizacion}`, pageWidth - 70, y + 7);

  // ===== SERVICIOS =====
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("SERVICIOS SELECCIONADOS:", 15, y);
  y += 10;
  doc.setDrawColor(198, 160, 58);
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  if (cotizacion.length === 0) {
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(12);
    doc.text("No hay servicios seleccionados.", 15, y);
  } else {
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    cotizacion.forEach((serv, i) => {
      if (y > 260) {
        doc.addPage();
        y = 25;
      }
      doc.text(`${i + 1}. ${serv}`, 20, y);
      y += 8;
      doc.setDrawColor(230, 230, 230);
      doc.line(15, y, pageWidth - 15, y);
      y += 4;
    });
  }

  // ===== OBSERVACIONES =====
  y += 15;
  if (y > 260) {
    doc.addPage();
    y = 25;
  }
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 38, 108);
  doc.text("Observaciones:", 15, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(70, 70, 70);
  doc.setFontSize(11);
  doc.text(
    "Esta cotización no constituye una obligación contractual. Los valores finales se determinarán según la inspección técnica y el alcance definidos con el cliente.",
    15,
    y,
    { maxWidth: pageWidth - 30, align: "justify" }
  );

  // ===== PIE =====
  const footerY = 285;
  doc.setDrawColor(198, 160, 58);
  doc.line(0, footerY - 5, pageWidth, footerY - 5);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "KOLBING INGENIERÍA S.A.S. — Comprometidos con la calidad, la seguridad y la eficiencia industrial.",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  doc.save(`Cotizacion_Kolbing_${numCotizacion}.pdf`);
}

// ===== WHATSAPP =====
function abrirWhatsApp() {
  const numero = "573332438346"; // ✅ Número actualizado
  if (cotizacion.length === 0) {
    alert("Por favor, selecciona al menos un servicio antes de continuar.");
    return;
  }
  const mensaje = `Hola, estoy interesado en los siguientes servicios de Kolbing Ingeniería:\n\n${cotizacion
    .map((s) => `• ${s}`)
    .join("\n")}\n\n¿Podrían brindarme más información?`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}




window.addEventListener("load", () => {
  const banner = document.querySelector(".banner-servicios");
  banner.style.opacity = 0;
  banner.style.transition = "opacity 1.5s ease";
  setTimeout(() => (banner.style.opacity = 1), 100);
});

document.addEventListener("DOMContentLoaded", () => {
  const thumb = document.getElementById("thumb");
  const playBtn = document.getElementById("play-btn");
  const wrapper = document.querySelector(".video-wrapper");

  if (playBtn && thumb && wrapper) {
    playBtn.addEventListener("click", () => {
      wrapper.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/bu4iYKqy6mo?autoplay=1" 
          title="Servicios Kolbing"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    });
  }
});

  
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

// Reveal on scroll for footer elements
document.addEventListener("DOMContentLoaded", () => {
  const toReveal = document.querySelectorAll('.footer-column, .footer-social');
  if (!('IntersectionObserver' in window)) {
    toReveal.forEach(el => el.classList.add('is-visible'));
    return;
  }

  toReveal.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  toReveal.forEach(el => io.observe(el));
});

// Abrir solo enlaces EXTERNOS en nueva pestaña; los .html internos quedan igual
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const lower = href.toLowerCase();
    // Ignora anclas internas y esquemas especiales
    if (lower.startsWith('#') || lower.startsWith('mailto:') || lower.startsWith('tel:') || lower.startsWith('javascript:')) {
      return;
    }

    let url;
    try { url = new URL(href, window.location.href); } catch { return; }

    const isSameOrigin = url.origin === window.location.origin;
    const isHtmlPage = /\.html(\?|#|$)/i.test(url.pathname);

    if (!isSameOrigin) {
      // Enlaces externos -> nueva pestaña
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else if (isHtmlPage) {
      // Navegación interna a .html -> misma pestaña
      a.removeAttribute('target');
      a.removeAttribute('rel');
    }
  });
});

// Animación de entrada del header manteniéndolo transparente en top
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;
  header.classList.add("header-animate");
  if (window.scrollY <= 10) {
    header.classList.add("transparent");
  }
});

