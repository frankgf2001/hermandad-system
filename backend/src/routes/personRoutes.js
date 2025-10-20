import express from "express";
import { getAllPersons, createPerson } from "../controllers/personController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👥 Obtener todas las personas
router.get("/", authenticateToken, getAllPersons);

// ➕ Crear nueva persona (solo roles permitidos)
router.post("/", authenticateToken, authorizeRoles("Administrator", "Treasurer"), createPerson);

export default router;
