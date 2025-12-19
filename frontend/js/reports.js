import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized, ExportAPI } from "./api.js";
import { excelFormat } from "../utils/excelUtil.js"

const reportTable = document.getElementById("reportTable");
const currentTypeLabel = document.getElementById("currentType");

const endpoints = {
  day: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
};

const reportNames = {
  day: "diario",
  week: "semanal",
  month: "mensual",
  year: "anual",
};

let typeReport = "";
// ===================================================
// 🔹 Cargar reporte por tipo
// ===================================================
window.loadReport = async function (type) {
  // Mapeo entre botones del front y endpoints reales del backend
  typeReport = type;

  // Actualiza etiqueta del tipo de reporte
  currentTypeLabel.textContent = `Generando reporte ${reportNames[type] || ""}...`;
  showLoading(`Cargando reporte ${reportNames[type]}...`);
  
  try {
    const res = await fetch(`${API_BASE_URL}/reports/${endpoints[type] || "monthly"}`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const response = await handleResponse(res);

    const data = response.data || response;
    renderReport(data, type);

    currentTypeLabel.textContent = `Mostrando reporte ${reportNames[type]}`;
  } catch (error) {
    console.error("❌ Error al cargar el reporte:", error);
    currentTypeLabel.textContent = "Error al generar el reporte.";
    showTableMessage("Error al cargar los datos.", "error");
  }
};

document.getElementById("btnExportExcel")?.addEventListener("click", async () => {
  try {
    if(typeReport == ""){
      alert("Debe seleccionar un tipo de reporte");
      return;
    }

    const data = {
      typeReport: endpoints[typeReport]
    }
    const res = await ExportAPI.getExportReport(data);
    excelFormat(res, `Reporte ${reportNames[typeReport]}`);
  } catch (e) {
    console.error("❌ Error export:", e);
    alert("No se pudo descargar el Excel: " + e.message);
  }
});

// ===================================================
// 🔹 Renderizar tabla de resultados
// ===================================================
function renderReport(data, type) {
  reportTable.innerHTML = "";

  if (!data || data.length === 0) {
    showTableMessage("No hay datos disponibles para este reporte.");
    return;
  }

  const rows = data
    .map((item) => {
      const income = Number(item.total_income || 0);
      const expense = Number(item.total_expense || 0);
      const balance = income - expense;

      return `
        <tr class="border-b hover:bg-emerald-50 transition">
          <td class="py-2 px-3 text-gray-700">${formatPeriod(item.period, type)}</td>
          <td class="py-2 px-3 text-emerald-700 font-medium">S/ ${formatNumber(income)}</td>
          <td class="py-2 px-3 text-red-600 font-medium">S/ ${formatNumber(expense)}</td>
          <td class="py-2 px-3 font-semibold ${balance >= 0 ? "text-emerald-700" : "text-red-700"}">
            S/ ${formatNumber(balance)}
          </td>
        </tr>`;
    })
    .join("");

  reportTable.innerHTML = rows;
}

// ===================================================
// 🔹 Funciones de UI
// ===================================================
function showLoading(message) {
  reportTable.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-emerald-600 py-3 animate-pulse">${message}</td>
    </tr>`;
}

function showTableMessage(message, type = "info") {
  const color =
    type === "error"
      ? "text-red-500"
      : type === "success"
      ? "text-emerald-600"
      : "text-gray-400";

  reportTable.innerHTML = `
    <tr>
      <td colspan="4" class="text-center ${color} py-3">${message}</td>
    </tr>`;
}

// ===================================================
// 🔹 Formateadores
// ===================================================
function formatPeriod(period, type) {
  if (!period) return "-";

  switch (type) {
    case "day":
      return new Date(period).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    case "week":
      return `Semana ${period}`;
    case "month":
      const [year, month] = period.split("-");
      return `${getMonthName(month)} ${year}`;
    case "year":
      return period;
    default:
      return period;
  }
}

function getMonthName(monthNumber) {
  const num = parseInt(monthNumber, 10);
  return new Date(2000, num - 1, 1).toLocaleString("es-PE", { month: "long" });
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}