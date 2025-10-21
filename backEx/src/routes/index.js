import { Router } from "express";
import carritoRouter from "./carritoRoutes.js"
import categoriaRouter from "./categoriaRoutes.js"
import cuponDescuentoRoutes from "./cuponDescuentoRoutes.js"
import itemCarritoRouter from "./itemCarritoRoutes.js"
import itemOrdenRouter from "./itemOrdenRoutes.js"
import ordenRouter from "./ordenRoutes.js"
import productoRoutes from "./productoRoutes.js"
import usuarioRoutes from "./usuarioRoutes.js"
import administradorRouter from "./administradorRoutes.js"
import authRouter from "./authRoutes.js"
import chatRoutes from "./chatBotRoutes.js";
import routerArchivos from "./ArchivosRoutes.js";
import mensajeRouter from "./mensajeRoutes.js";

//api/v1/productos/:id
const allRouter = Router();
allRouter.use("/carritos", carritoRouter);
allRouter.use("/categorias", categoriaRouter);
allRouter.use("/cupones", cuponDescuentoRoutes);
allRouter.use("/itemsCarrito", itemCarritoRouter);
allRouter.use("/itemsOrden", itemOrdenRouter);
allRouter.use("/ordenes", ordenRouter);
allRouter.use("/productos", productoRoutes);
allRouter.use("/usuarios", usuarioRoutes);
allRouter.use("/administradores", administradorRouter);
allRouter.use("/auth", authRouter);
allRouter.use('/chatbot', chatRoutes);
allRouter.use("/files", routerArchivos);
allRouter.use("/mensajes", mensajeRouter);

export default allRouter;




