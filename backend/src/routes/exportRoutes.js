import express from "express";
import { exportPersonsExcel, exportExpensesExcel, exportIncomesExcel } from "../controllers/exportController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/persons", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportPersonsExcel);
router.get("/expenses", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportExpensesExcel);
router.get("/incomes", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportIncomesExcel);

export default router;