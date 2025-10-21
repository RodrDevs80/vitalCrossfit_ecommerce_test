import sequelize from "../config/db/connection.js";
import Producto from "./Producto.js";
import Usuario from "./Usuario.js";
import Orden from "./Orden.js";
import Carrito from "./Carrito.js";
import ItemCarrito from "./ItemCarrito.js";
import ItemOrden from "./ItemOrden.js";
import Categoria from "./Categoria.js";
import CuponDescuento from "./CuponDescuento.js";
import Administrador from "./administrador.js";
import Archivo from "./Archivos.js";
import Mensaje from "./Mensaje.js";

// --- Definir Asociaciones ---

// Relación Usuario <-> Carrito (1:1)
Usuario.hasOne(Carrito, {
    foreignKey: "idUsuario",
    sourceKey: "id"
});
Carrito.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetKey: "id",
});

// Relación Usuario <-> Orden (1:N)
Usuario.hasMany(Orden, {
    foreignKey: "idUsuario",
    sourceKey: "id",
});
Orden.belongsTo(Usuario, {
    foreignKey: "idUsuario",
    targetKey: "id",
});

// Relación Carrito <-> ItemCarrito (1:N)
Carrito.hasMany(ItemCarrito, {
    foreignKey: "idCarrito",
    sourceKey: "id",
});
ItemCarrito.belongsTo(Carrito, {
    foreignKey: "idCarrito",
    targetKey: "id",
});

// Relación Orden<-> ItemOrden (1:N)
Orden.hasMany(ItemOrden, {
    foreignKey: "idOrden",
    sourceKey: "id",
});
ItemOrden.belongsTo(Orden, {
    foreignKey: "idOrden",
    targetKey: "id",
});
// Relación Producto<-> ItemCarrito (1:N)
Producto.hasMany(ItemCarrito, {
    foreignKey: "idProducto",
    sourceKey: "id",
});
ItemCarrito.belongsTo(Producto, {
    foreignKey: "idProducto",
    targetKey: "id",
});
// Relación Categoria<->Producto  (1:N)
Categoria.hasMany(Producto, {
    foreignKey: "idCategoria",
    sourceKey: "id",
});
Producto.belongsTo(Categoria, {
    foreignKey: "idCategoria",
    targetKey: "id",
});
// Relación Producto <-> ItemOrden  (1:N)
Producto.hasMany(ItemOrden, {
    foreignKey: "idProducto",
    sourceKey: "id",
});
ItemOrden.belongsTo(Producto, {
    foreignKey: "idProducto",
    targetKey: "id",
});
//La relación optima seria N:N pero por cuestiones de tiempo se establece un 
//relación 1:N entre Producto <--> CuponDescuento
Producto.hasMany(CuponDescuento, {
    foreignKey: "idProducto",
    sourceKey: "id"
})
CuponDescuento.belongsTo(Producto, {
    foreignKey: "idProducto",
    targetKey: "id"
})
//relación de Archivo con producto
Producto.hasMany(Archivo, {
    foreignKey: 'idProducto',
    as: 'archivos'
})

Archivo.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
})
//relación de Mensaje con producto
Producto.hasMany(Mensaje, {
    foreignKey: 'idProducto',
    as: 'mensajes'
})

Mensaje.belongsTo(Producto, {
    foreignKey: 'idProducto',
    as: 'producto'
})

export { sequelize }