import { API_BASE_URL, getAuthHeaders, handleResponse, logoutIfUnauthorized } from "./api.js";

// ===============================
// 🔹 Elementos del DOM
// ===============================
const form = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const logoutBtn = document.getElementById("logoutBtn");

// ===============================
// 🔹 Eventos
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await saveExpense();
});

window.addEventListener("DOMContentLoaded", async () => {
  await loadExpenses();
});

logoutBtn?.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});

// ===============================
// 🔹 Guardar un nuevo gasto
// ===============================
async function saveExpense() {
  const expenseData = {
    person_id: form.person_id.value.trim(),
    amount: parseFloat(form.amount.value),
    date: form.date.value || new Date().toISOString().split("T")[0],
    observation: form.observation.value.trim(),
  };

  if (!expenseData.person_id || !expenseData.amount) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });

    await logoutIfUnauthorized(res);
    await handleResponse(res);

    alert("Expense registered successfully ✅");
    form.reset();
    await loadExpenses();
  } catch (error) {
    console.error("❌ Error saving expense:", error);
    alert("Error registering expense. Please try again.");
  }
}

// ===============================
// 🔹 Listar todos los gastos
// ===============================
async function loadExpenses() {
  expenseTable.innerHTML = `
    <tr>
      <td colspan="5" class="text-center text-gray-400 py-3">Loading...</td>
    </tr>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/expenses`, {
      headers: getAuthHeaders(),
    });

    await logoutIfUnauthorized(res);
    const data = await handleResponse(res);
    renderExpenses(data);
  } catch (error) {
    console.error("❌ Error loading expenses:", error);
    expenseTable.innerHTML = `
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
function renderExpenses(expenses) {
  expenseTable.innerHTML = "";

  if (!expenses || expenses.length === 0) {
    expenseTable.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-gray-400 py-3">No expense records found.</td>
      </tr>
    `;
    return;
  }

  expenses.forEach((exp, index) => {
    const row = `
      <tr class="border-b hover:bg-red-50">
        <td class="py-2">${index + 1}</td>
        <td>${exp.person_id || "-"}</td>
        <td class="text-red-700 font-semibold">S/ ${formatNumber(exp.amount)}</td>
        <td>${formatDate(exp.date)}</td>
        <td>${exp.observation || "-"}</td>
      </tr>
    `;
    expenseTable.insertAdjacentHTML("beforeend", row);
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