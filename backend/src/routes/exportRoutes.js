import express from "express";
import { exportPersonsExcel, exportExpensesExcel, exportIncomesExcel, exportReportExcel } from "../controllers/exportController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/persons", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportPersonsExcel);
router.get("/expenses", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportExpensesExcel);
router.get("/incomes", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportIncomesExcel);
router.post("/report", authenticateToken, authorizeRoles("Administrator", "Treasurer"), exportReportExcel);

export default router;