import express from "express";
import { getAllPersons, createPerson, getPersonUsers } from "../controllers/personController.js";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 👥 Obtener todas las personas
router.get("/", authenticateToken, getAllPersons);

// ➕ Crear nueva persona (solo roles permitidos)
router.post("/", authenticateToken, authorizeRoles("Administrator", "Treasurer"), createPerson);

// 👥 Obtener lista de usuarios asociados
router.get("/users", authenticateToken, getPersonUsers);

export default router;
