import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized, ExportAPI } from "./api.js";
import { excelFormat } from "../utils/excelUtil.js"

// ===============================
// 🔹 Elementos del DOM
// ===============================
const form = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const refreshBtn = document.getElementById("refreshBtn");

// ===============================
// 🔹 Inicialización
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  showLoading("Cargando egresos...");
  await Promise.all([loadExpenses(), loadPersons()]);
});

refreshBtn?.addEventListener("click", async () => {
  showLoading("Actualizando...");
  await loadExpenses();
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveExpense();
});

// ===============================
// 🔹 Guardar egreso
// ===============================
async function saveExpense() {
  const data = getFormData();

  if (!data.person_id || !data.amount) {
    showAlert("Por favor complete los campos requeridos.", "warning");
    return;
  }

  try {
    showLoading("Guardando egreso...");

    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    await logoutIfUnauthorized(res);
    await handleResponse(res);

    showAlert("✅ Egreso registrado con éxito.", "success");
    form.reset();
    await loadExpenses();
  } catch (error) {
    console.error("❌ Error al guardar egreso:", error);
    showAlert("Error al registrar el egreso. Intente nuevamente.", "error");
  }
}

// ===============================
// 🔹 Cargar egresos
// ===============================
async function loadExpenses() {
  try {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);

    renderExpenses(data);
  } catch (error) {
    console.error("❌ Error al cargar egresos:", error);
    showTableMessage("Error al cargar los datos.", "error");
  }
}

// ===============================
// 🔹 Cargar personas tipo "usuario"
// ===============================
async function loadPersons() {
  try {
    const res = await fetch(`${API_BASE_URL}/persons/users`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);

    const select = document.getElementById("person_id");
    select.innerHTML = `<option value="">Seleccione una persona</option>`;

    data.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = `${p.first_name} ${p.last_name} (${p.dni})`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("❌ Error al cargar personas:", error);
    showAlert("No se pudo cargar la lista de personas.", "error");
  }
}

// ===============================
// 🔹 Exportar archivo Excel
// ===============================
document.getElementById("btnExportExcel")?.addEventListener("click", async () => {
  try {
    const res = await ExportAPI.getExportExpense();
    excelFormat(res, "Reporte de Egresos");
  } catch (e) {
    console.error("❌ Error export:", e);
    alert("No se pudo descargar el Excel: " + e.message);
  }
});

// ===============================
// 🔹 Renderizar tabla
// ===============================
function renderExpenses(expenses = []) {
  expenseTable.innerHTML = "";

  if (expenses.length === 0) {
    showTableMessage("No hay egresos registrados aún.");
    return;
  }

  const rows = expenses
    .map(
      (exp, i) => `
        <tr class="hover:bg-red-50 transition">
          
          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${i + 1}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-700">
            ${exp.person_name || "-"}
          </td>

          <td class="px-4 py-3 text-center align-middle font-semibold text-red-600">
            S/ ${formatNumber(exp.amount)}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${formatDate(exp.expense_date)}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${exp.expense_type || "-"}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-500">
            ${exp.description || "-"}
          </td>

        </tr>
      `
    )
    .join("");

  expenseTable.insertAdjacentHTML("beforeend", rows);
}

// ===============================
// 🔹 Utilitarios
// ===============================
function getFormData() {
  return {
    person_id: parseInt(form.person_id.value),
    amount: parseFloat(form.amount.value),
    expense_type: form.expense_type.value.trim(),
    description: form.description.value.trim(),
    date: form.date.value || new Date().toISOString().split("T")[0],
  };
}

function showLoading(message) {
  expenseTable.innerHTML = `
    <tr>
      <td colspan="6" class="text-center text-red-600 py-3 animate-pulse">${message}</td>
    </tr>`;
}

function showTableMessage(message, type = "info") {
  const color =
    type === "error"
      ? "text-red-500"
      : type === "success"
      ? "text-red-600"
      : "text-gray-400";

  expenseTable.innerHTML = `
    <tr>
      <td colspan="6" class="text-center ${color} py-3">${message}</td>
    </tr>`;
}

function showAlert(message, type = "info") {
  const colors = {
    success: "#16a34a",
    error: "#b91c1c",
    warning: "#ca8a04",
  };

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${colors[type] || "#dc2626"};
    color: white;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 14px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    z-index: 50;
  `;
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.opacity = "1"), 50);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

