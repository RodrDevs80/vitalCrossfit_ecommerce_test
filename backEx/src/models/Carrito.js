import { DataTypes } from "sequelize";
import sequelize from "../config/db/connection.js";


const Carrito = sequelize.define("Carrito", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "usuarios",
            key: "id"
        }
    }
}, {
    tableName: "carritos",
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
})

export default Carrito;