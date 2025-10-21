import sequelize from "../config/db/connection.js";
//recordar ejecutar: node node .\src\scripts\syripts.js
const syncDatabase = async () => {
    try {
        console.log("🔄 Sincronizando base de datos...");

        await sequelize.authenticate();
        console.log("✅ Conexión a DB establecida");

        /* Sincroniza los modelos con la base de datos.
        force: false (default) - No borra tablas si existen.
        force: true - Borra y recrea tablas. ¡PELIGROSO en producción!
        alter: true - Intenta modificar tablas existentes.*/
        await sequelize.sync({ alter: true });
        console.log("✅ Modelos sincronizados exitosamente");

        console.log("🎉 Sincronización completada");
        //process.exit(0);
    } catch (error) {
        console.error("❌ Error durante la sincronización:", error);
        //process.exit(1);
    }
};

syncDatabase();