document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.querySelector('nav ul');

  menuToggle.addEventListener('click', () => {
    menuNav.classList.toggle('active');
  });
});

function enviarFormulario(event) {
      event.preventDefault();
      const form = document.getElementById("form-cita");
      const toast = document.getElementById("toast");

      // Enviar el formulario al iframe oculto
      form.submit();

      // Mostrar notificación tipo toast
      toast.style.display = "block";
      toast.style.opacity = "1";

      // Ocultar después de 3 segundos
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => (toast.style.display = "none"), 500);
      }, 3000);

      // Reset del formulario
      form.reset();
    }

  document.addEventListener('DOMContentLoaded', () => {
    const botonAgendar = document.querySelector('.btn-agendar');
    const formulario = document.getElementById('formulario-cita');

    if (botonAgendar && formulario) {
      botonAgendar.addEventListener('click', () => {
        formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });