import { DataTypes } from "sequelize";
import sequelize from "../config/db/connection.js";
import bcrypt from "bcrypt";

const Usuario = sequelize.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
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
  /**
   Rol según el gasto acumulado:
   Bronce: Gasto bajo (ej.: menos de $100 al año).
   Plata: Gasto medio (ej.: $100–$500 al año).
   Oro: Gasto alto (ej.: más de $500 al año). 
  */

  rol: {
    type: DataTypes.ENUM('bronce', 'plata', 'oro'),
    allowNull: false,
    defaultValue: 'bronce'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: "usuarios",
  timestamps: true,
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
});

//hashear contraseña
Usuario.beforeCreate(async (usuario) => {
  if (usuario.contrasena) {
    const saltRounds = 12;
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, saltRounds);
  }
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('contrasena')) {
    const saltRounds = 12;
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, saltRounds);
  }
});

// Métodos de instancia para probar ‼️
Usuario.prototype.validarContrasena = async function (contrasena) {
  return await bcrypt.compare(contrasena, this.contrasena);
};

Usuario.prototype.getNombreCompleto = function () {
  return `${this.nombre} ${this.apellido}`;
};

Usuario.prototype.esAdministrador = function () {
  return this.rol === 'administrador';
};

// Métodos estáticos para probar ‼️
Usuario.findByEmail = function (email) {
  return this.findOne({ where: { email } });
};

Usuario.findActivos = function () {
  return this.scope('activos').findAll();
};

export default Usuario;