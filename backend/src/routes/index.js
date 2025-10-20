// src/routes/index.js
import express from "express";

// ✅ Importar módulos de rutas
import authRoutes from "./authRoutes.js";
import personRoutes from "./personRoutes.js";
import incomeRoutes from "./incomeRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import reportRoutes from "./reportRoutes.js";

const router = express.Router();

// ✅ Agrupación de módulos bajo /api
router.use("/auth", authRoutes);
router.use("/persons", personRoutes);
router.use("/incomes", incomeRoutes);
router.use("/expenses", expenseRoutes);
router.use("/reports", reportRoutes);

export default router;