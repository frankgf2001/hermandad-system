import { PersonsAPI, RolesAPI, logoutIfUnauthorized, ExportAPI } from "../js/api.js";
import { showAlert, showModal, formatDate, toggleFormState } from "../utils/ui.js";

const form = document.getElementById("personForm");
const tableBody = document.getElementById("personTable");
const submitBtn = document.getElementById("submitBtn");
const userTypeSelect = document.getElementById("user_type");

// ================================
// 🔹 Inicialización
// ================================
document.addEventListener("DOMContentLoaded", async () => {
  await loadRoles();
  await loadPersons();
});

// ================================
// 🔹 Cargar roles
// ================================
async function loadRoles() {
  const select = document.getElementById("user_type");
  select.innerHTML = `<option value="">Cargando roles...</option>`;

  try {
    const roles = await RolesAPI.getAll();

    // 🔍 Verifica que la API realmente devuelva un arreglo
    if (!Array.isArray(roles) || roles.length === 0) {
      select.innerHTML = `<option value="">No hay roles disponibles</option>`;
      console.warn("⚠️ No se recibieron roles desde el backend:", roles);
      return;
    }

    // ✅ Poblamos el select con los datos correctos
    select.innerHTML = `<option value="">Seleccione tipo de usuario</option>`;
    roles.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id; // ← el ID numérico del rol
      opt.textContent = r.role_name; // ← el nombre legible
      select.appendChild(opt);
    });
  } catch (error) {
    console.error("❌ Error al cargar roles:", error);
    showAlert("Error al cargar tipos de usuario.", "error");
    select.innerHTML = `<option value="">Error al cargar roles</option>`;
  }
}

// ================================
// 🔹 Cargar personas
// ================================
async function loadPersons() {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-6 text-emerald-600 animate-pulse">
          Cargando registros...
        </td>
      </tr>
    `;

    const res = await PersonsAPI.getAll();

    // 🔹 Soporta tanto respuesta directa (array) como objeto con "persons"
    const persons = Array.isArray(res) ? res : res.persons ?? [];

    renderTable(persons);
  } catch (error) {
    console.error("❌ Error al cargar personas:", error);
    showAlert("Error al cargar personas.", "error");
  }
}

// ================================
// 🔹 Renderizar tabla
// ================================
function renderTable(persons) {

  console.log(persons);

  tableBody.innerHTML = "";
  if (!persons || persons.length === 0) {
    tableBody.innerHTML = `
      <tr><td colspan="7" class="text-center text-gray-400 py-5 italic">
        No hay registros disponibles.
      </td></tr>`;
    return;
  }

  persons.forEach((p, i) => {
    tableBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="border-b hover:bg-emerald-50 transition duration-150">
        <td class="py-2 px-3">${i + 1}</td>
        <td>${p.full_name ?? ""}</td>
        <td>${p.dni ?? "-"}</td>
        <td>${p.phone ?? "-"}</td>
        <td>${p.address ?? "-"}</td>
        <td>${p.role_name ?? "-"}</td>
        <td>${formatDate(p.created_at)}</td>
      </tr>
      `
    );
  });
}

// ================================
// 🔹 Crear persona
// ================================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const person = {
    first_name: form.first_name.value.trim(),
    last_name: form.last_name.value.trim(),
    dni: form.dni.value.trim(),
    phone: form.phone.value.trim() || null,
    address: form.address.value.trim() || null,
    birth_date: form.birth_date.value || null,
    role_id: userTypeSelect.value,
  };

  if (!person.first_name || !person.last_name || !person.dni || !person.role_id) {
    showAlert("Por favor complete todos los campos requeridos.", "warning");
    return;
  }

  try {
    toggleFormState(form, true);
    submitBtn.textContent = "Guardando...";

    const res = await PersonsAPI.create(person);
    showAlert("Persona registrada exitosamente.", "success");

    const html = `
      <p><strong>Nombre:</strong> ${res.person.full_name}</p>
      <p><strong>Usuario:</strong> ${res.person.username}</p>
      <p><strong>Rol:</strong> ${res.person.role_name}</p>
      <p><strong>Teléfono:</strong> ${res.person.phone || "-"}</p>
      <p><strong>Dirección:</strong> ${res.person.address || "-"}</p>
      <p><strong>Fecha de registro:</strong> ${formatDate(res.person.created_at)}</p>
      <hr class="my-3">
      <p class="text-sm text-gray-500">
        La contraseña inicial es igual al DNI del usuario.
      </p>
    `;
    showModal("Persona registrada correctamente", html);

    form.reset();
    await loadPersons();
  } catch (err) {
    console.error("❌ Error creando persona:", err);
    if (err.message.includes("401")) logoutIfUnauthorized({ status: 401 });
    showAlert(err.message || "Error al guardar persona.", "error");
  } finally {
    toggleFormState(form, false);
    submitBtn.textContent = "Guardar";
  }
});

// ================================
// 🔹 Logout
// ================================
document.getElementById("logoutBtn").onclick = () => {
  sessionStorage.clear();
  window.location.href = "index.html";
};

document.getElementById("btnExportExcel")?.addEventListener("click", async () => {
  try {
    const res = await ExportAPI.getExportPerson();

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Nombre del archivo (si viene en header)
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+)"/);
    const fileName = match?.[1] || "reporte.xlsx";

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error("❌ Error export:", e);
    alert("No se pudo descargar el Excel: " + e.message);
  }
});
