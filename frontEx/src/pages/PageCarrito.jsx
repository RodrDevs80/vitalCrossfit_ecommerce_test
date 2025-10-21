import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutCliente } from "../services/serviceLogout";
import swalServiceConfirmed from "../services/swalServiceConfirmed";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import getItemsCarritoSer from "../services/getItemsCarritoSer";
import getUserByIdLibre from "../services/getuserByIdlibre";
import NombreProducto from "../components/NombreProducto";
import ImgProducto from "../components/ImgProducto";
import deleteItemsCarritoSer from "../services/deleteItemsCarritoSer";
import SwAlertaComp from "../services/SwAlertaComp";
import updateItemsCarrito from "../services/updateItemsCarrito";
import ShippingModal from "../components/ShippingModal";
import createOrdenService from "../services/createOrdenService";
import createItemOrdenService from "../services/createItemsOrdenServ";
import getProductoById from "../services/getProductoById";

const PageCarrito = () => {
  const navigate = useNavigate();
  // Estado para los productos en el carrito
  const { setTokenCliente, setRolTyCliente, idCliente } =
    useContext(AuthContext);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [descuento, setDescuento] = useState(0);

  const getDescuento = (id) => {
    getProductoById(id)
      .then((res) => setDescuento(res.descuento / 100))
      .catch((err) => console.log(err.message));
  };

  // Función para actualizar cantidad
  const updateQuantity = (id, item, newQuantity) => {
    if (newQuantity < 1) return;

    updateItemsCarrito(id, {
      idCarrito: item.idCarrito,
      idProducto: item.idProducto,
      cantidad: newQuantity,
      precioUnitario: item.price,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          getItemscarritoFronDB();
        }
      })
      .catch((err) => {
        console.log(err.message);
        SwAlertaComp(
          "Error",
          "Error al intentar modificar la cantidad de un producto del carrito",
          "error"
        );
      });
  };

  // Función para eliminar producto
  const removeItem = async (id) => {
    const confirmado = await swalServiceConfirmed(
      "Importante!",
      "Esta por eliminar un producto del carrito",
      "info",
      "Si, eliminar",
      "Cancelar"
    );
    if (!confirmado) {
      return;
    }
    deleteItemsCarritoSer(id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          SwAlertaComp(
            "Eliminado",
            "Se elimino de manera exitosa el producto del carrito",
            "success"
          );
          getItemscarritoFronDB();
        }
      })
      .catch((err) => {
        console.log(err.message);
        SwAlertaComp(
          "Error",
          "Error al intentar eliminar un producto del carrito",
          "error"
        );
      });
  };

  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) =>
        total +
        Number((item.price - item.price * descuento).toFixed(2)) *
          item.quantity,
      0
    );
  };

  const comprarAndVaciarCarrito = async () => {
    const confirmar = await swalServiceConfirmed(
      "Compraste de manera exitosa!🎉",
      "Recibirás un email con el detalle de tu compra!",
      "success",
      "Vaciar carrito",
      "Cancelar"
    );
    if (confirmar) {
      cartItems.forEach((item) =>
        deleteItemsCarritoSer(item.id)
          .then((res) => {
            if (res.status === 200) {
              console.log("Se elimino del carrito: ", res);
              getItemscarritoFronDB();
            }
          })
          .catch((err) => {
            console.log(err.message);
            SwAlertaComp(
              "Error!❌",
              "Error al intentar realizar la eliminar item del carrito",
              "error"
            );
          })
      );
    }
  };

  // Función para confirmar compra
  const handleConfirmPurchase = (shippingInfo) => {
    //console.log(shippingInfo);
    setShowShippingModal(false);
    //creo el body de la orden
    const bodyOrden = {
      idUsuario: idCliente,
      nombreEnvio: shippingInfo.shipping.nombreEnvio,
      direccionEnvio: shippingInfo.shipping.direccionEnvio,
      telefonoEnvio: shippingInfo.shipping.telefonoEnvio,
      estado: "pendiente",
    };
    console.log("Body Orden: ", bodyOrden);
    createOrdenService(bodyOrden)
      .then((res) => {
        if (res.status === 201) {
          cartItems
            .map((item) => {
              return {
                id: item.id,
                idOrden: res.data.id,
                idProducto: item.idProducto,
                precioUnitario: item.price,
                cantidad: item.quantity,
              };
            })
            .forEach((item) =>
              createItemOrdenService(item)
                .then((res) => {
                  if (res.status === 201) {
                    console.log("item creado de manera exitosa: ", res.data.id);
                  }
                })
                .catch((err) => {
                  console.log(err.message);
                })
            );
          comprarAndVaciarCarrito();
        }
      })
      .catch((err) => {
        console.log(err.message);
        SwAlertaComp(
          "Error!❌",
          "Error al intentar realizar la compra!",
          "error"
        );
      });
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    const confirmar = await swalServiceConfirmed(
      "Saliendo de la cuenta cliente",
      "¿Desea salir de su cuenta usuario?",
      "info",
      "Salir",
      "Cancelar"
    );
    if (confirmar) {
      logoutCliente();
      setTokenCliente(null);
      setRolTyCliente(null);
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  // Función para volver al home
  const handleBackToHome = () => {
    navigate("/");
  };
  const getItemscarritoFronDB = () => {
    getItemsCarritoSer()
      .then((res) => {
        console.log(res.data);
        const newStatecarrito = res.data.map((item) => {
          getDescuento(item.idProducto);
          return {
            id: item.id,
            idProducto: item.idProducto,
            price: item.precioUnitario,
            quantity: item.cantidad,
            idCarrito: item.idCarrito,
          };
        });
        setCartItems(newStatecarrito);
      })
      .catch((err) => console.log(err.message));
  };
  const getUserInfo = () => {
    getUserByIdLibre(idCliente)
      .then((res) =>
        setCustomerInfo({
          name: `${res.usuario.nombre} ${res.usuario.apellido}`,
          email: res.usuario.email,
          nivel: res.usuario.rol,
        })
      )
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getItemscarritoFronDB();
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handleBackToHome}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center w-full sm:w-auto text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver al Inicio
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left w-full sm:w-auto">
                Carrito de Compras
              </h1>
            </div>

            {/* Información del Cliente en Header para móviles */}
            <div className="lg:hidden w-full">
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Información del Cliente
                </h3>
                <div className="space-y-1">
                  <div>
                    <label className="text-xs text-gray-600">Nombre:</label>
                    <p className="font-medium text-gray-800 text-sm">
                      {customerInfo.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Email:</label>
                    <p className="font-medium text-gray-800 text-sm">
                      {customerInfo.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Nivel:</label>
                    <p className="font-medium text-gray-800 text-sm">
                      {customerInfo.nivel}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center w-full text-sm"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>

            {/* Botón Cerrar Sesión solo para desktop */}
            <button
              onClick={handleLogout}
              className="hidden lg:flex bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 items-center justify-center text-sm sm:text-base"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>

            <ToastContainer />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Columna izquierda - Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Productos en el Carrito
              </h2>

              {cartItems && cartItems.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-base sm:text-lg">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={handleBackToHome}
                    className="mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition duration-200 text-sm sm:text-base"
                  >
                    Volver a Comprar
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {cartItems &&
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
                      >
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <ImgProducto idProducto={item.idProducto} />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                            <NombreProducto idProducto={item.idProducto} />
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base">
                            Precio unitario: $
                            {descuento == 0
                              ? item.price
                              : Number(
                                  (item.price - item.price * descuento).toFixed(
                                    2
                                  )
                                )}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item, item.quantity - 1)
                              }
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                            >
                              -
                            </button>
                            <span className="w-8 sm:w-12 text-center font-medium text-gray-800 text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item, item.quantity + 1)
                              }
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200 text-sm sm:text-base"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between sm:block sm:text-right">
                          <p className="text-base sm:text-lg font-semibold text-gray-800">
                            $
                            {Number(
                              (item.price - item.price * descuento).toFixed(2) *
                                item.quantity
                            ).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm mt-1 transition duration-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Resumen e información del cliente (solo desktop) */}
          <div className="hidden lg:block space-y-6">
            {/* Información del Cliente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Información del Cliente
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Nombre:</label>
                  <p className="font-medium text-gray-800">
                    {customerInfo.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email:</label>
                  <p className="font-medium text-gray-800">
                    {customerInfo.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Nivel:</label>
                  <p className="font-medium text-gray-800">
                    {customerInfo.nivel}
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-lg font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowShippingModal(true)}
                  disabled={cartItems.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition duration-200 ${
                    cartItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed text-gray-200"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  Confirmar Compra
                </button>

                <button
                  onClick={handleBackToHome}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Compra para móviles - Fijo en la parte inferior */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-800">
                Total:
              </span>
              <span className="text-lg font-bold text-blue-600">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowShippingModal(true)}
                disabled={cartItems.length === 0}
                className={`py-3 px-4 rounded-lg font-semibold transition duration-200 text-sm ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Confirmar Compra
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition duration-200 text-sm flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>

        {/* Espacio para el footer fijo en móviles */}
        <div className="lg:hidden h-24"></div>
      </div>
      {/* Modal de Información de Envío */}
      <ShippingModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
};

export default PageCarrito;
