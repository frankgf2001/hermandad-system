import express from "express";
import { getExpenses, addExpense } from "../controllers/expenseController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Solo usuarios autenticados pueden ver
router.get("/", authenticateToken, getExpenses);

// Solo Administradores o Tesoreros pueden agregar
router.post("/", authenticateToken, authorizeRoles("Administrator", "Treasurer"), addExpense);

export default router;
