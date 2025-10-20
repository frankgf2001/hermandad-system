// 🔒 auth-guard.js
// Protege las páginas internas y gestiona el cierre de sesión

// ✅ Verificar sesión al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.replace("index.html");
  }
});

// 🚪 Cerrar sesión correctamente
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.replace("index.html");
    });
  }
}

// 🧭 Evitar que el usuario vuelva con el botón “Atrás” del navegador
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.replace("index.html");
    }
  }
});

// ✅ Exponer funciones globales
window.setupLogoutButton = setupLogoutButton;