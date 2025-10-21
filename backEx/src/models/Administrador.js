import sequelize from "../config/db/connection.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const Administrador = sequelize.define("Administrador",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false
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
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: 'El apellido debe tener entre 2 y 50 caracteres'
        },
        notEmpty: {
          msg: 'El apellido no puede estar vacío'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este email ya está registrado'
      },
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido'
        },
        notEmpty: {
          msg: 'El email no puede estar vacío'
        }
      }
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 90],
          msg: 'La contraseña debe tener entre 8 y 90 caracteres'
        },
        isComplex(value) {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);

          if (!(hasUpperCase && hasLowerCase && hasNumber)) {
            throw new Error('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
          }
        }
      }
    },
    rol: {
      type: DataTypes.ENUM('admin', 'fulladmin'),
      allowNull: false,
      defaultValue: 'admin'
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
  tableName: "administradores", timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion',
  // Scope por defecto: excluir contraseña
  defaultScope: {
    attributes: { exclude: ['contrasena'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['contrasena'] }
    },
    activos: {
      where: { activo: true }
    }
  }
})

//hashear contraseña
Administrador.beforeCreate(async (administrador) => {
  if (administrador.contrasena) {
    const saltRounds = 12;
    administrador.contrasena = await bcrypt.hash(administrador.contrasena, saltRounds);
  }
});

Administrador.beforeUpdate(async (administrador) => {
  if (administrador.changed('contrasena')) {
    const saltRounds = 12;
    administrador.contrasena = await bcrypt.hash(administrador.contrasena, saltRounds);
  }
});


export default Administrador;