import express from "express";
import {
  getExpenses,
  addExpense,
  getExpensesByPerson,
  deleteExpense,
} from "../controllers/expenseController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener todos los egresos
router.get("/", authenticateToken, getExpenses);

// Obtener egresos de una persona específica
router.get("/person/:id", authenticateToken, getExpensesByPerson);

// Registrar un nuevo egreso (solo para administradores o tesoreros)
router.post("/", authenticateToken, authorizeRoles("Administrator", "Treasurer"), addExpense);

// Eliminar egreso (opcional, solo roles privilegiados)
router.delete("/:id", authenticateToken, authorizeRoles("Administrator", "Treasurer"), deleteExpense);

export default router;
