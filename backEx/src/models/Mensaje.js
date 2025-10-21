import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";

const Mensaje = sequelize.define("Mensaje", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
        unique: true
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "productos",
            key: "id"
        }
    },
}, {
    tableName: "mensajes",
    timestamps: true,
    createdAt: "fechaCreacion",
    updatedAt: "fechaActualizacion"
})

export default Mensaje;