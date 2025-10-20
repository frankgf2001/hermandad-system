// 🔒 auth-guard.js
// Este script protege las páginas internas y gestiona el logout de sesión.

// ✅ Verificar sesión al cargar cualquier página protegida
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.replace("index.html"); // Redirige si no hay sesión
  }
});

// 🚪 Cerrar sesión correctamente
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.replace("index.html");
  });
}

// 🧭 Evitar acceso con botón “Atrás” del navegador
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.replace("index.html");
    }
  }
});
