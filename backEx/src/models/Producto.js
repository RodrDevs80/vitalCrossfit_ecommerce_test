import { DataTypes } from "sequelize";
import sequelize from "../config/db/connection.js";

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: {
                args: [2, 50],
                msg: 'El nombre debe tener entre 2 y 50 caracteres'
            },
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            }
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La descripción no puede estar vacía'
            }
        }
    },
    precio: {
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
    },
    imagenUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    especificaciones: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "categorias",
            key: "id"
        }
    },
    oferta: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    descuento: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'El descuento no puede ser negativo'
            },
            max: {
                args: [100],
                msg: 'El descuento excede el límite máximo'
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: "productos",
    timestamps: true,
    createdAt: "fechaCreacion",
    updatedAt: "fechaActualizacion",
    scopes: {
        activos: { where: { activo: true } }
    }
}
)

export default Producto;