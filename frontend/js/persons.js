import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized } from "./api.js";

const form = document.getElementById("personForm");
const tableBody = document.getElementById("personTable");

// =========================
// 🔹 Inicialización
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  await loadPersons();
});

// =========================
// 🔹 Cargar personas
// =========================
async function loadPersons() {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-6 text-emerald-600 animate-pulse">
          Cargando registros...
        </td>
      </tr>
    `;

    const res = await fetch(`${API_BASE_URL}/persons`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);
    renderTable(data);
  } catch (error) {
    console.error("❌ Error al cargar personas:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-red-500 py-4">
          Error al cargar datos. Intente nuevamente.
        </td>
      </tr>
    `;
  }
}

// =========================
// 🔹 Renderizar tabla
// =========================
function renderTable(persons) {
  tableBody.innerHTML = "";

  if (!persons || persons.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-gray-400 py-5 italic">
          No hay registros de personas disponibles.
        </td>
      </tr>
    `;
    return;
  }

  persons.forEach((p, index) => {
    const row = `
      <tr class="border-b hover:bg-emerald-50 transition-colors duration-150">
        <td class="py-2 text-sm text-gray-700">${index + 1}</td>
        <td class="text-gray-800">${sanitize(p.first_name)} ${sanitize(p.last_name)}</td>
        <td>${p.dni || "-"}</td>
        <td>${p.phone || "-"}</td>
        <td>${p.address || "-"}</td>
        <td class="text-sm text-gray-500">${formatDate(p.created_at)}</td>
      </tr>
    `;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// =========================
// 🔹 Guardar nueva persona
// =========================
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = form.first_name.value.trim();
  const lastName = form.last_name.value.trim();

  if (!firstName || !lastName) {
    showAlert("Por favor ingrese nombre y apellido.", "warning");
    return;
  }

  const newPerson = {
    first_name: firstName,
    last_name: lastName,
    dni: form.dni.value.trim() || null,
    phone: form.phone.value.trim() || null,
    address: form.address.value.trim() || null,
    birth_date: form.birth_date.value || null,
  };

  try {
    toggleFormState(true);

    const res = await fetch(`${API_BASE_URL}/persons`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newPerson),
    });

    await logoutIfUnauthorized(res);
    await handleResponse(res);

    showAlert("✅ Persona registrada exitosamente.", "success");
    form.reset();
    await loadPersons();
  } catch (error) {
    console.error("❌ Error creando persona:", error);
    showAlert("Error al guardar. Intente nuevamente.", "error");
  } finally {
    toggleFormState(false);
  }
});

// =========================
// 🔹 Utilitarios visuales
// =========================
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
    case "success":
      return "bg-emerald-600";
    case "error":
      return "bg-red-600";
    case "warning":
      return "bg-yellow-500 text-gray-900";
    default:
      return "bg-gray-700";
  }
}

// =========================
// 🔹 Utilitarios funcionales
// =========================
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function sanitize(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char])
  );
}

function toggleFormState(disabled) {
  [...form.elements].forEach((el) => (el.disabled = disabled));
}