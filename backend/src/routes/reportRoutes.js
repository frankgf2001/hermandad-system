import express from "express";
import {
  getSummary,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport,
} from "../controllers/reportController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📊 Reportes con autenticación JWT
router.get("/summary", authenticateToken, getSummary);
router.get("/daily", authenticateToken, getDailyReport);
router.get("/weekly", authenticateToken, getWeeklyReport);
router.get("/monthly", authenticateToken, getMonthlyReport);
router.get("/yearly", authenticateToken, getYearlyReport);

export default router;
