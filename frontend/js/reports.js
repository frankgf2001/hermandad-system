import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized } from "./api.js";

const reportTable = document.getElementById("reportTable");

// =============================
// 🔹 Cargar reporte por tipo (día, semana, mes, año)
// =============================
window.loadReport = async function (type) {
  try {
    reportTable.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-emerald-600">
          Loading ${type} report...
        </td>
      </tr>
    `;

    const res = await fetch(`${API_BASE_URL}/reports/${encodeURIComponent(type)}`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);
    renderReport(data, type);
  } catch (error) {
    console.error("❌ Error loading report:", error);
    reportTable.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-red-600 py-3">
          Error loading report. Please try again.
        </td>
      </tr>
    `;
  }
};

// =============================
// 🔹 Renderizar tabla de reportes
// =============================
function renderReport(data, type) {
  reportTable.innerHTML = "";

  if (!data || data.length === 0) {
    reportTable.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-gray-400 py-3">
          No records found for this ${sanitize(type)} report.
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((item) => {
    const income = Number(item.total_income || 0);
    const expense = Number(item.total_expense || 0);
    const balance = income - expense;

    const row = `
      <tr class="border-b hover:bg-emerald-50 transition">
        <td class="py-2 text-gray-700">${formatPeriod(item.period, type)}</td>
        <td class="text-green-700 font-semibold">S/ ${formatNumber(income)}</td>
        <td class="text-red-600 font-semibold">S/ ${formatNumber(expense)}</td>
        <td class="font-bold ${balance >= 0 ? "text-emerald-700" : "text-red-700"}">
          S/ ${formatNumber(balance)}
        </td>
      </tr>
    `;
    reportTable.insertAdjacentHTML("beforeend", row);
  });
}

// =============================
// 🔹 Funciones auxiliares
// =============================
function formatPeriod(period, type) {
  if (!period) return "-";

  switch (type) {
    case "day":
      return new Date(period).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    case "week":
      return `Week ${sanitize(period)}`;
    case "month":
      const [year, month] = period.split("-");
      return `${getMonthName(month)} ${year}`;
    case "year":
      return sanitize(period);
    default:
      return sanitize(period);
  }
}

function getMonthName(monthNumber) {
  const num = parseInt(monthNumber, 10);
  if (isNaN(num) || num < 1 || num > 12) return "-";
  const date = new Date(2000, num - 1, 1);
  return date.toLocaleString("en-US", { month: "long" });
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// 🔒 Previene inyección de texto en los campos renderizados
function sanitize(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (char) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char])
  );
}