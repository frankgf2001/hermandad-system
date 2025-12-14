import express from "express";
import { exportPersonsExcel } from "../controllers/exportController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Exportar Excel (solo roles permitidos)
router.get(
  "/persons",
  authenticateToken,
  authorizeRoles("Administrator", "Treasurer"),
  exportPersonsExcel
);

export default router;