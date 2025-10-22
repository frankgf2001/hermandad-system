// ================================================
// 🌟 UI UTILITIES - Reutilizables en todo el sistema
// ================================================

/**
 * Muestra una alerta tipo toast
 */
export function showAlert(message, type = "info") {
  let alertBox = document.getElementById("alertBox");
  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "alertBox";
    document.body.appendChild(alertBox);
  }

  const color =
    type === "success"
      ? "bg-emerald-600"
      : type === "error"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500 text-gray-900"
      : "bg-gray-800";

  alertBox.className = `
    fixed top-6 left-1/2 transform -translate-x-1/2
    px-6 py-3 rounded-lg shadow-lg font-medium text-white z-50
    transition-all duration-500 ease-in-out ${color}
    animate-fadeInUp
  `;
  alertBox.textContent = message;

  setTimeout(() => {
    alertBox.style.opacity = "0";
    setTimeout(() => alertBox.remove(), 500);
  }, 3000);
}

/**
 * Modal para mostrar contenido informativo
 */
export function showModal(title, contentHTML) {
  const overlay = document.createElement("div");
  overlay.className = `
    fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50
    animate-fadeIn
  `;

  const modal = document.createElement("div");
  modal.className = `
    bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 mx-3
    transform scale-95 animate-popIn
  `;

  modal.innerHTML = `
    <h3 class="text-xl font-semibold text-primary mb-4">${title}</h3>
    <div class="text-gray-700 text-sm leading-relaxed">${contentHTML}</div>
    <div class="text-right mt-6">
      <button id="closeModalBtn" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition">
        Aceptar
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.getElementById("closeModalBtn").onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

/**
 * Formatear fecha al formato local
 */
export function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Habilitar/deshabilitar formulario durante operaciones
 */
export function toggleFormState(form, disabled) {
  [...form.elements].forEach((el) => (el.disabled = disabled));
}

// ================================================
// 🔸 Animaciones
// ================================================
const style = document.createElement("style");
style.textContent = `
@keyframes fadeIn { from {opacity:0;transform:translateY(15px);} to {opacity:1;transform:translateY(0);} }
@keyframes fadeInUp { from {opacity:0;transform:translateY(25px);} to {opacity:1;transform:translateY(0);} }
@keyframes popIn { from {opacity:0;transform:scale(0.9);} to {opacity:1;transform:scale(1);} }
.animate-fadeIn { animation: fadeIn .5s ease; }
.animate-fadeInUp { animation: fadeInUp .5s ease; }
.animate-popIn { animation: popIn .3s ease; }
`;
document.head.appendChild(style);
