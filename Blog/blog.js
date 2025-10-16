document.addEventListener("DOMContentLoaded", () => {
  // ➜ DURANTE DESARROLLO LOCAL: usa el server Flask en localhost:5000
  const API_BASE = "https://grupo-termica-backend.onrender.com/api";

  // === Referencias del DOM ===
  const newBlogBtn = document.getElementById("new-blog-btn");
  const modal = document.getElementById("blog-modal");
  const closeModal = document.querySelector(".close");
  const form = document.getElementById("blog-form");
  const viewModal = document.getElementById("view-modal");
  const closeView = document.querySelector(".close-view");

  let editId = null;

  // === Función genérica para manejar solicitudes al backend ===
  async function fetchJSON(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    if (!res.ok) {
      console.error("Error en fetch:", data);
      throw new Error(JSON.stringify(data, null, 2));
    }
    return data;
  }

  // === Cargar blogs al inicio ===
  async function loadBlogs() {
    try {
      const blogs = await fetchJSON(`${API_BASE}/blogs`);
      renderBlogs(blogs);
    } catch (e) {
      console.error("Error cargando blogs:", e);
      alert("⚠️ No se pudieron cargar los blogs.");
    }
  }

  // === Mostrar/Ocultar Modales ===
  newBlogBtn.addEventListener("click", () => {
    editId = null;
    document.getElementById("modal-title").innerText = "Crear Nuevo Blog";
    form.reset();
    modal.style.display = "flex";
  });
  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  closeView.addEventListener("click", () => (viewModal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === viewModal) viewModal.style.display = "none";
  });

  // === Crear o Editar un blog ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("blog-title").value.trim();
    const content = document.getElementById("blog-content").value.trim();
    const category = document.getElementById("blog-category").value;
    const imageFile = document.getElementById("blog-image").files[0];
    const adminKey = document.getElementById("admin-key").value.trim();

    if (!title || !content || !category)
      return alert("⚠️ Completa todos los campos obligatorios.");
    if (!adminKey)
      return alert("⚠️ Ingresa la clave de administrador (termica2025).");

    // Convertir imagen a Base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    let imageData = "";
    if (imageFile) imageData = await toBase64(imageFile);

    const payload = {
      title,
      content,
      category,
      image: imageData,
      admin_key: adminKey, // 🔐 Importante: enviar siempre la clave
    };

    try {
      if (editId) {
        // Si es edición
        if (!imageFile) delete payload.image; // no reemplazar si no hay nueva imagen
        await fetchJSON(`${API_BASE}/blogs/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("✅ Blog modificado correctamente.");
      } else {
        // Si es nuevo
        await fetchJSON(`${API_BASE}/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        alert("✅ Blog creado correctamente.");
      }
      modal.style.display = "none";
      await loadBlogs();
    } catch (err) {
      console.error("Error guardando:", err);
      alert("❌ Error al guardar el blog. Ver consola.");
    }
  });

  // === Renderizar blogs en pantalla ===
  function renderBlogs(blogs) {
    ["salud", "saneamiento", "aire"].forEach((cat) => {
      const container = document.getElementById(`${cat}-blogs`);
      container.innerHTML = "";

      blogs
        .filter((b) => b.category === cat)
        .forEach((blog) => {
          const card = document.createElement("div");
          card.className = "blog-card";
          card.innerHTML = `
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}">` : ""}
            <div class="blog-card-content">
              <h4>${blog.title}</h4>
              <p>${blog.content.substring(0, 140)}...</p>
              <div class="blog-actions">
                <button class="btn-view">Ver</button>
                <button class="btn-edit">Editar</button>
                <button class="btn-delete">Eliminar</button>
              </div>
            </div>
          `;

          // === Ver Blog ===
          card.querySelector(".btn-view").onclick = () => {
            document.getElementById("view-title").innerText = blog.title;
            document.getElementById("view-text").innerText = blog.content;
            document.getElementById("view-img").src = blog.image || "";
            viewModal.style.display = "flex";
          };

          // === Editar Blog ===
          card.querySelector(".btn-edit").onclick = async () => {
            const clave = prompt("🔑 Ingrese la clave de administrador:");
            if (!clave) return;
            if (clave !== "termica2025") {
              alert("❌ Clave incorrecta.");
              return;
            }

            editId = blog.id;
            document.getElementById("modal-title").innerText = "Editar Blog";
            document.getElementById("blog-title").value = blog.title;
            document.getElementById("blog-content").value = blog.content;
            document.getElementById("blog-category").value = blog.category;
            document.getElementById("admin-key").value = clave;
            modal.style.display = "flex";
          };

          // === Eliminar Blog ===
          card.querySelector(".btn-delete").onclick = async () => {
            const clave = prompt("🔑 Ingrese la clave de administrador para eliminar:");
            if (!clave) return;
            if (clave !== "termica2025") {
              alert("❌ Clave incorrecta.");
              return;
            }
            if (!confirm("¿Seguro que deseas eliminar este blog?")) return;

            try {
              await fetchJSON(`${API_BASE}/blogs/${blog.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ admin_key: clave }),
              });
              alert("🗑️ Blog eliminado correctamente.");
              await loadBlogs();
            } catch (err) {
              console.error("Error eliminando:", err);
              alert("❌ Error al eliminar el blog. Ver consola.");
            }
          };

          container.appendChild(card);
        });
    });
  }

  // === Cargar blogs al iniciar ===
  loadBlogs();
});



// === Menú hamburguesa (tu script) ===
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const menuNav = document.querySelector('nav ul');
  menuToggle.addEventListener('click', () => {
    menuNav.classList.toggle('active');
  });
});
