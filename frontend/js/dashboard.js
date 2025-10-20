// Configuración de Tailwind 
tailwind.config = {
    theme: {
        extend: {
        colors: {
            primary: "#2e7d32",
            cream: "#fefcfb",
        },
        },
    },
};

//Seguridad, bienvenida y fecha 
document.addEventListener("DOMContentLoaded", () => {
    const username = sessionStorage.getItem("username");
    const welcomeTitle = document.getElementById("welcomeTitle");
    const dateElement = document.getElementById("currentDate");

    // 🚨 Verificación de sesión
    if (!sessionStorage.getItem("token")) {
        window.location.href = "index.html";
        return;
    }

    // 🕐 Saludo inteligente
    const hour = new Date().getHours();
    let greeting = "Bienvenido";
    if (hour >= 5 && hour < 12) greeting = "Buenos días";
    else if (hour >= 12 && hour < 19) greeting = "Buenas tardes";
    else greeting = "Buenas noches";

    // 🧑‍💼 Mostrar nombre formateado
    if (username && welcomeTitle) {
        const formattedName =
        username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
        welcomeTitle.innerHTML = `
        ${greeting}, <span class="font-bold">${formattedName}</span> 👋
        `;
    } else {
        welcomeTitle.textContent = "Bienvenido al Panel de Control Económico";
    }

    // 📅 Mostrar fecha actual
    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today
        .toLocaleDateString("es-ES", options)
        .replace(/^./, (s) => s.toUpperCase());
    dateElement.textContent = formattedDate;

    // 🚪 Logout
    document.getElementById("logoutBtn").onclick = () => {
        sessionStorage.clear();
        window.location.href = "index.html";
    };
});