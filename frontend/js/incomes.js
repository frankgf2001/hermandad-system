import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized } from "./api.js";

// ===============================
// 🔹 Elementos del DOM
// ===============================
const form = document.getElementById("incomeForm");
const incomeTable = document.getElementById("incomeTable");
const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// 🔹 Eventos
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveIncome();
});

window.addEventListener("DOMContentLoaded", async () => {
  await loadIncomes();
});

logoutBtn?.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// ===============================
// 🔹 Guardar un nuevo ingreso
// ===============================
async function saveIncome() {
  const incomeData = {
    person_id: form.person_id.value.trim(),
    amount: parseFloat(form.amount.value),
    date: form.date.value || new Date().toISOString().split("T")[0],
    observation: form.observation.value.trim(),
  };

  if (!incomeData.person_id || !incomeData.amount) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/incomes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(incomeData),
    });

    await logoutIfUnauthorized(res);
    await handleResponse(res);

    alert("Income registered successfully ✅");
    form.reset();
    await loadIncomes();
  } catch (error) {
    console.error("❌ Error saving income:", error);
    alert("Error registering income. Please try again.");
  }
}

// ===============================
// 🔹 Listar todos los ingresos
// ===============================
async function loadIncomes() {
  incomeTable.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-gray-400 py-3">Loading...</td>
    </tr>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/incomes`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);
    renderIncomes(data);
  } catch (error) {
    console.error("❌ Error loading incomes:", error);
    incomeTable.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-red-500 py-3">
          Error loading data.
        </td>
      </tr>
    `;
  }
}

// ===============================
// 🔹 Renderizar tabla
// ===============================
function renderIncomes(incomes) {
  incomeTable.innerHTML = "";

  if (!incomes || incomes.length === 0) {
    incomeTable.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-gray-400 py-3">No income records found.</td>
      </tr>
    `;
    return;
  }

  incomes.forEach((inc, index) => {
    const row = `
      <tr class="border-b hover:bg-emerald-50">
        <td class="py-2">${index + 1}</td>
        <td>${inc.person_id || "-"}</td>
        <td class="text-green-700 font-semibold">S/ ${formatNumber(inc.amount)}</td>
        <td>${formatDate(inc.date)}</td>
        <td>${inc.observation || "-"}</td>
      </tr>
    `;
    incomeTable.insertAdjacentHTML("beforeend", row);
  });
}

// ===============================
// 🔹 Utilitarios
// ===============================
function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}