import express from "express";
import { getAllRoles } from "../controllers/roleController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🎭 Obtener todos los roles
 * Solo accesible para Administrador
 */
router.get("/", authenticateToken, authorizeRoles("Administrator"), getAllRoles);

export default router;
