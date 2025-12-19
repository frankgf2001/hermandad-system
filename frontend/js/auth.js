import { API_BASE_URL, handleResponse } from "./api.js";

// ===============================
// 🔹 Elementos del DOM
// ===============================
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// ===============================
// 🔹 Inicialización
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("token")) {
    // Si ya está logueado, lo mandamos al dashboard
    window.location.href = "dashboard.html";
  }
});

// ===============================
// 🔹 Evento: login submit
// ===============================
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleLogin();
});

// ===============================
// 🔹 Función principal de login
// ===============================
async function handleLogin() {
  const username = sanitize(usernameInput.value.trim());
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showAlert("Por favor, completa todos los campos.", "warning");
    return;
  }

  try {
    toggleFormState(true);
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await handleResponse(res);

    // Validar formato del token recibido
    if (!result.token || !/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(result.token)) {
      throw new Error("Formato de token inválido.");
    }

    saveSession(result.token, username);
    console.log("Frank_funcionaaaa")
    showAlert("Inicio de sesión éxitoso!! Redireccionando...", "success");

    setTimeout(() => (window.location.href = "dashboard.html"), 800);
  } catch (error) {
    console.error("❌ Login error:", error);
    showAlert("Login failed: " + (error.message || "Intenta de nuevo."), "error");
  } finally {
    toggleFormState(false);
  }
}

// ===============================
// 🔹 Utilitarios de sesión
// ===============================
function saveSession(token, username) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("username", username);
}

export function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

// ===============================
// 🔹 Seguridad: Sanitización
// ===============================
function sanitize(input) {
  return input.replace(/[&<>"']/g, (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c])
  );
}

// ===============================
// 🔹 UI Helpers
// ===============================
function toggleFormState(isDisabled) {
  [usernameInput, passwordInput, ...loginForm.querySelectorAll("button")].forEach(
    (el) => (el.disabled = isDisabled)
  );
}

function showAlert(message, type = "info") {
  let alertBox = document.getElementById("alertBox");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "alertBox";
    document.body.appendChild(alertBox);
  }

  alertBox.className = `
    fixed top-6 left-1/2 transform -translate-x-1/2
    px-6 py-3 rounded-lg shadow-lg font-medium text-white z-50
    transition-all duration-500 ease-in-out
    ${getAlertColor(type)}
  `;
  alertBox.textContent = message;

  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => alertBox.remove(), 500);
  }, 3000);
}

function getAlertColor(type) {
  switch (type) {
    case "success": return "bg-emerald-600";
    case "error": return "bg-red-600";
    case "warning": return "bg-yellow-500 text-gray-900";
    default: return "bg-gray-700";
  }
}
