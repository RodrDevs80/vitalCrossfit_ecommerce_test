import express from "express";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./src/models/index.js";
import { errorHandler, notFound } from "./src/middleware/errorHander.js";
import helmet from "helmet";
import allRouter from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT;
const Raiz = process.env.API_RAIZ;


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Middleware de seguridad
app.use(helmet());

app.use(cors({
    origin: ['http://localhost:5173'], // o tu dominio frontend
    credentials: true
}));
app.use(morgan('dev'));
//ruta de salud
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

app.use(Raiz, allRouter);
// Middleware para rutas no encontradas

app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Ruta de salud de la API

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log(
            "✅ Conexión a la base de datos establecida correctamente."
        );

        /* Sincroniza los modelos con la base de datos.
        force: false (default) - No borra tablas si existen.
        force: true - Borra y recrea tablas. ¡PELIGROSO en producción!
        alter: true - Intenta modificar tablas existentes.*/
        //await sequelize.sync({ alter: true }); // Cambia bajo tu propio riesgo
        //console.log("🔄 Modelos sincronizados con la base de datos.");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
}



startServer();



