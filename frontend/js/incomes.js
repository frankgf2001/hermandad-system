// ======================================================
// 🔹 Importaciones base
// ======================================================
import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized, ExportAPI} from "./api.js";
import { excelFormat } from "../utils/excelUtil.js"

// ======================================================
// 🔹 Elementos del DOM
// ======================================================
const form = document.getElementById("incomeForm");
const incomeTable = document.getElementById("incomeTable");

// ======================================================
// 🔹 Inicialización
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {
  showLoading("Cargando ingresos...");
  await Promise.all([loadIncomes(), loadPersons()]);
});

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveIncome();
});

// ======================================================
// 🔹 Guardar ingreso
// ======================================================
async function saveIncome() {
  const incomeData = getFormData();

  if (!isValidIncome(incomeData)) {
    showAlert("Por favor completa los campos requeridos.", "warning");
    return;
  }

  try {
    showLoading("Guardando ingreso...");

    const res = await fetch(`${API_BASE_URL}/incomes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(incomeData),
    });

    await logoutIfUnauthorized(res);
    await handleResponse(res);

    showAlert("Ingreso registrado con éxito.", "success");
    form.reset();
    await loadIncomes();
  } catch (error) {
    console.error("Error al guardar el ingreso:", error);
    showAlert("Error al registrar el ingreso. Intenta nuevamente.", "error");
  }
}

// ======================================================
// 🔹 Cargar lista de ingresos
// ======================================================
async function loadIncomes() {
  try {
    const res = await fetch(`${API_BASE_URL}/incomes`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);

    renderIncomes(data);
  } catch (error) {
    console.error("Error al cargar ingresos:", error);
    showTableMessage("Error al cargar los datos.", "error");
  }
}

// ======================================================
// 🔹 Cargar lista de personas tipo "usuario"
// ======================================================
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
    console.error("Error al cargar personas:", error);
    showAlert("No se pudo cargar la lista de personas.", "error");
  }
}

// ===============================
// 🔹 Exportar archivo Excel
// ===============================
document.getElementById("btnExportExcel")?.addEventListener("click", async () => {
  try {
    console.log("frank gf")
    const res = await ExportAPI.getExportIncome();
    excelFormat(res, "Reporte de Ingresos");
  } catch (e) {
    console.error("❌ Error export:", e);
    alert("No se pudo descargar el Excel: " + e.message);
  }
});

// ======================================================
// 🔹 Renderizar tabla de ingresos
// ======================================================
function renderIncomes(incomes = []) {
  incomeTable.innerHTML = "";

  if (incomes.length === 0) {
    showTableMessage("No hay ingresos registrados aún.");
    return;
  }

  const rows = incomes
    .map(
      (inc, index) => `
        <tr class="hover:bg-emerald-50 transition">
          <td class="px-4 py-3 text-center align-middle text-gray-700">
            ${index + 1}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-700">
            ${inc.person_name || "-"}
          </td>

          <td class="px-4 py-3 text-center align-middle font-semibold text-emerald-600">
            S/ ${formatNumber(inc.amount)}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${formatDate(inc.income_date)}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${inc.income_type || "-"}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-600">
            ${inc.reference || "-"}
          </td>

          <td class="px-4 py-3 text-center align-middle text-gray-500">
            ${inc.notes || "-"}
          </td>
        </tr>
      `
    )
    .join("");

  incomeTable.insertAdjacentHTML("beforeend", rows);
}

// ======================================================
// 🔹 Utilitarios de formulario y validación
// ======================================================
function getFormData() {
  return {
    person_id: parseInt(form.person_id.value),
    amount: parseFloat(form.amount.value),
    income_type: form.income_type.value.trim(),
    reference: form.reference.value.trim(),
    notes: form.notes.value.trim(),
    date: form.date.value || null,
  };
}

function isValidIncome({ person_id, amount }) {
  return person_id && amount && !isNaN(amount);
}

// ======================================================
// 🔹 Funciones UI auxiliares
// ======================================================
function showLoading(message = "Cargando...") {
  incomeTable.innerHTML = `
    <tr>
      <td colspan="7" class="text-center text-emerald-600 py-3 animate-pulse">${message}</td>
    </tr>
  `;
}

function showTableMessage(message, type = "info") {
  const color =
    type === "error"
      ? "text-red-500"
      : type === "success"
      ? "text-emerald-600"
      : "text-gray-400";

  incomeTable.innerHTML = `
    <tr>
      <td colspan="7" class="text-center ${color} py-3">${message}</td>
    </tr>
  `;
}

function showAlert(message, type = "info") {
  const color =
    type === "success"
      ? "#059669"
      : type === "error"
      ? "#dc2626"
      : "#ca8a04";

  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${color};
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

// ======================================================
// 🔹 Utilitarios de formato
// ======================================================
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