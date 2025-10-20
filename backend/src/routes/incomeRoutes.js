import express from "express";
import { getIncomes, addIncome } from "../controllers/incomeController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 💰 Income Routes
 * Protegidas con JWT para garantizar acceso solo a usuarios autenticados
 */

// ✅ Obtener todos los ingresos
router.get("/", authenticateToken, getIncomes);

// ✅ Agregar un nuevo ingreso
router.post("/", authenticateToken, addIncome);

export default router;
