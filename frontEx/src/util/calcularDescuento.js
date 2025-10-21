
export const calcularDescuento = (precio, descuento) => {
    return (precio - ((precio * descuento) / 100)).toFixed(2);
}

