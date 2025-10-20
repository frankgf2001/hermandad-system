// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import pool from "./src/config/db.js";

dotenv.config();
const app = express();

// ✅ Middlewares globales
app.use(cors());
app.use(express.json());

// ✅ Verificar conexión con la base de datos
pool
  .getConnection()
  .then(() => console.log("✅ MySQL connected successfully"))
  .catch((err) => console.error("❌ MySQL connection error:", err));

// ✅ Rutas principales agrupadas
app.use("/api", routes);

// ✅ Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Hermandad API is running...");
});

// ✅ Manejo global de errores (fallback)
app.use((err, req, res, next) => {
  console.error("💥 Global Error Handler:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);