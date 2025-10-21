import { Router } from "express";
import { createUsuario, deleteLogicoUsuario, deleteUsuario, getAllUsuario, getAllUsuariosActivos, getUsuarioById, updateUsuario } from "../controllers/usuarioController.js";
import { protect, authorizeAdministrador, ROLES_ADMINISTRADOR, authorizeUsuario, ROLES_USUARIO } from "../middleware/auth.middleware.js"

const usuarioRouter = Router();

usuarioRouter.get("/all", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), getAllUsuario);

usuarioRouter.get("/activos", protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), getAllUsuariosActivos);

usuarioRouter.get('/:id', protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), getUsuarioById);

//http://localhost:3000/api/v1/usuarios/consultaSimple/:id
usuarioRouter.get("/consultaSimple/:id", getUsuarioById);

usuarioRouter.post("/", createUsuario);

usuarioRouter.put('/:id', updateUsuario);

//Eliminación física
usuarioRouter.delete('/:id', protect, authorizeAdministrador(ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN), deleteUsuario);

// Eliminación lógica
usuarioRouter.patch("/:id", protect, authorizeUsuario(ROLES_USUARIO.BRONCE, ROLES_USUARIO.PLATA, ROLES_USUARIO.ORO), deleteLogicoUsuario);

export default usuarioRouter;