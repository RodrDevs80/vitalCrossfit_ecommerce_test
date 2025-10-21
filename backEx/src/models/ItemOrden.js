import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";

const ItemOrden = sequelize.define("ItemOrden", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    idOrden: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "ordenes",
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
    tableName: "itemsOrden",
    timestamps: false,
})

export default ItemOrden;