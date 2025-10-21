import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";

const Categoria = sequelize.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imagenUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "categorias",
    timestamps: true,
    createdAt: "fechaDeCreacion",
    updatedAt: "fechaDeActualizacion",
    scopes: {
        activos: {
            where: { activo: true }
        }
    }
})


export default Categoria;