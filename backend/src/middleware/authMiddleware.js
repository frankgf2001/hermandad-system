import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Autenticación JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "hermandad_secret_key_2025", (err, user) => {
    if (err) return res.status(403).json({ message: "El token ha expirado. Vuelve a iniciar sesión." });
    req.user = user;
    next();
  });
};

// 🔒 Autorización por roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "El perfil no tiene permiso para realizar esta acción" });
    }
    next();
  };
};