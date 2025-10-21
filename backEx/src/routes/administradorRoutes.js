import { Router } from "express";
import { protect, authorizeAdministrador, ROLES_ADMINISTRADOR } from "../middleware/auth.middleware.js";
import { getAdmin, getAdminById, deleteAdmin, createAdmin, updateAdmin, deleteLogicoAdmin } from "../controllers/administradorController.js";

const administradorRouter = Router();
// GET /api/v1/administradores - Obtener todos los usuarios (Solo Admin)
administradorRouter.get("/", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), getAdmin);

// GET /api/v1/administradores/:id - Obtener un usuario por ID
administradorRouter.get("/:id", protect, getAdminById);

// POST /api/v1/administradores - Crear un nuevo usuario (Solo Admin, el registro es en /auth/register)
administradorRouter.post("/", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), createAdmin);

// PUT /api/v1/administradores/:id - Actualizar un administrador
administradorRouter.put("/:id", protect, updateAdmin);

// DELETE /api/v1/administradores/:id - Eliminar un usuario (Solo Admin)
administradorRouter.delete("/:id", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), deleteAdmin);
// PATCH borrado lógico-desactiva y activa Administrador /api/v1/administradores/:id - Eliminar un usuario (Solo Admin)
administradorRouter.patch("/:id", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), deleteLogicoAdmin);



export default administradorRouter;