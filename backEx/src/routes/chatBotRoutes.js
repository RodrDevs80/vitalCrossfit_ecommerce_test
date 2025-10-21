import { Router } from "express";
import { obtenerRespuesta } from "../controllers/chatController.js";
import rateLimit from "express-rate-limit";
import compression from "compression";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas solicitudes, intenta más tarde' }
});

const chatRoutes = Router();
chatRoutes.use(limiter);
chatRoutes.use(compression());
chatRoutes.post('/', obtenerRespuesta);

export default chatRoutes;