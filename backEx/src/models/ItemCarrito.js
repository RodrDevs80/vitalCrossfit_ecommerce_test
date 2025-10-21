import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";

const ItemCarrito = sequelize.define("ItemCarrito", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    idCarrito: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "carritos",
            key: "id"
        }
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "productos",
            key: "id"
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'El precio no puede ser negativo'
            },
            max: {
                args: [99999999.99],
                msg: 'El precio excede el límite máximo'
            }
        }
    }
}, {
    tableName: "itemsCarrito",
    timestamps: false,
})

export default ItemCarrito;