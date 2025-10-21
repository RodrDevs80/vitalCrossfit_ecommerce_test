import { Router } from "express";
import { refreshTokenAdmin, refreshTokenUser, register, signin } from "../controllers/authController.js";


const authRouter = Router();

// POST /api/v1/auth/register - Registrar un nuevo administrador o usuario
authRouter.post('/register', register);

// POST /api/v1/auth/login - Iniciar sesión
authRouter.post('/login', signin);

// POST /api/v1/auth/refresh-token-usuario  -Refrescar el token de acceso
authRouter.post('/refresh-token-usuario', refreshTokenUser);

// POST /api/v1/auth/refresh-token-admin  -Refrescar el token de acceso
authRouter.post('/refresh-token-admin', refreshTokenAdmin);


export default authRouter;