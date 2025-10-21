import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";

const CuponDescuento = sequelize.define("CuponDescuento", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  porcentajeDescuento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'El porcentaje de descuento no puede ser negativo'
      },
      max: {
        args: [100],
        msg: 'El porcentaje de descuento  excede el límite máximo'
      }
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "productos",
      key: "id"
    }
  }
}, {
  tableName: "cuponesDescuento",
  timestamps: true,
  createdAt: "fechaCreacion",
  updatedAt: "fechaActualizacion",
  scopes: {
    activo: {
      where: {
        activo: true
      }
    }
  }
})

export default CuponDescuento;
