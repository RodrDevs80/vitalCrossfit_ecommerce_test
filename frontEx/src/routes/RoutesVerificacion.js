export const condicion = (location) => {
    return location.pathname === "/login" ||
        location.pathname === "/administrador" ||
        location.pathname === "/registro" ||
        location.pathname === "/administrador/panel" ||
        location.pathname === "/administrador/productos" ||
        location.pathname === "/administrador/categorias" ||
        location.pathname === "/administrador/usuarios" ||
        location.pathname === "/administrador/cupones" ||
        location.pathname === "/administrador/pedidos" ||
        location.pathname.includes("/administrador/pedidos/detalles") ||
        location.pathname === "/administrador/galeria" ||
        location.pathname === "/carrito"
}
