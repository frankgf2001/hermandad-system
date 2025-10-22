// ================================================
// 🔹 API Configuration (Base URL)
// ================================================
export const API_BASE_URL = "http://localhost:3000/api"; // Cambia al desplegar

// ================================================
// 🔹 Auth Headers (para peticiones autenticadas)
// ================================================
export function getAuthHeaders() {
  const token = sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ================================================
// 🔹 Generic request helper
// ================================================
async function request(endpoint, method = "GET", data = null) {
  const url = `${API_BASE_URL}${endpoint}`;

  const options = {
    method,
    headers: getAuthHeaders(),
  };

  if (data) options.body = JSON.stringify(data);

  const response = await fetch(url, options);
  return handleResponse(response);
}

// ================================================
// 🔹 Universal response handler (used by auth.js)
// ================================================
export async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// ================================================
// 🔹 Auto logout if unauthorized (401)
// ================================================
export async function logoutIfUnauthorized(response) {
  if (response.status === 401) {
    alert("⚠️ Sesión expirada. Por favor, inicie sesión nuevamente.");
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

// ================================================
// 🔹 PERSONS
// ================================================
export const PersonsAPI = {
  getAll: () => request("/persons"),
  getById: (id) => request(`/persons/${id}`),
  create: (person) => request("/persons", "POST", person),
  update: (id, person) => request(`/persons/${id}`, "PUT", person),
  delete: (id) => request(`/persons/${id}`, "DELETE"),
};

// ================================================
// 🔹 INCOMES
// ================================================
export const IncomesAPI = {
  getAll: () => request("/incomes"),
  getByPersonId: (personId) => request(`/incomes/person/${personId}`),
  create: (income) => request("/incomes", "POST", income),
  update: (id, income) => request(`/incomes/${id}`, "PUT", income),
  delete: (id) => request(`/incomes/${id}`, "DELETE"),
};

// ================================================
// 🔹 EXPENSES
// ================================================
export const ExpensesAPI = {
  getAll: () => request("/expenses"),
  getByPersonId: (personId) => request(`/expenses/person/${personId}`),
  create: (expense) => request("/expenses", "POST", expense),
  update: (id, expense) => request(`/expenses/${id}`, "PUT", expense),
  delete: (id) => request(`/expenses/${id}`, "DELETE"),
};

// ================================================
// 🔹 REPORTS
// ================================================
export const ReportsAPI = {
  getDaily: () => request("/reports/day"),
  getWeekly: () => request("/reports/week"),
  getMonthly: () => request("/reports/month"),
  getYearly: () => request("/reports/year"),
};

// ================================================
// 🔹 ROLES
// ================================================
export const RolesAPI = {
  getAll: () => request("/roles"), // Usa tu helper 'request' ya existente
};