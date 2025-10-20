// ===============================
// 🎨 Configuración de Tailwind
// ===============================
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#2e7d32",
        cream: "#fefcfb",
      },
    },
  },
};

// ===============================
// 🔒 Seguridad y bienvenida
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const welcomeTitle = document.getElementById("welcomeTitle");
  const dateElement = document.getElementById("currentDate");

  // 🚨 Validar sesión
  if (!token) {
    window.location.replace("index.html");
    return;
  }

  // 🕐 Mensaje de saludo dinámico
  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? "Buenas noches"
      : hour < 12
      ? "Buenos días"
      : hour < 19
      ? "Buenas tardes"
      : "Buenas noches";

  // 🧑‍💼 Mostrar nombre con formato profesional
  const formattedName =
    username && username.length > 0
      ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
      : "Usuario";

  if (welcomeTitle) {
    welcomeTitle.innerHTML = `${greeting}, <span class="font-bold">${formattedName}</span> 👋`;
  }

  // 📅 Mostrar fecha local
  if (dateElement) {
    const today = new Date();
    const formattedDate = today
      .toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .replace(/^./, (s) => s.toUpperCase());

    dateElement.textContent = formattedDate;
  }

  // 🚪 Logout seguro
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.replace("index.html");
    });
  }

  // 🧭 Prevenir regreso con botón “Atrás”
  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !sessionStorage.getItem("token")) {
      window.location.replace("index.html");
    }
  });
});