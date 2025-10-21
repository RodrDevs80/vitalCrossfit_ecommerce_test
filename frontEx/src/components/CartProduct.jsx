import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShoppingCartRounded, Visibility } from "@mui/icons-material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Link, useNavigate } from "react-router-dom";
import { calcularDescuento } from "../util/calcularDescuento";
import { AuthContext } from "../context/AuthContext";
import SwAlertaComp from "../services/SwAlertaComp";
import getCarritoByIdUserSer from "../services/getCarritoByIdUserSer";
import createItemCarritoService from "../services/createItemCarritoSer";
import createCarritoService from "../services/createCarrito";
import getItemsCarritoSer from "../services/getItemsCarritoSer";
import updateItemsCarrito from "../services/updateItemsCarrito";
import DescripcionConAlturaFija from "./DescripcionConAlturaFija";

export default function CartProduct({
  id,
  img,
  titulo,
  nombreProducto,
  descripcion,
  precio,
  oferta,
  descuento,
  cupon,
  cuponValido,
}) {
  const { tokenCliente, rolTypeCliente, idCliente } =
    React.useContext(AuthContext);
  const navigate = useNavigate();
  const handleCompra = (producto) => {
    if (tokenCliente && rolTypeCliente === "usuario") {
      //console.log(producto, idCliente);
      getCarritoByIdUserSer(idCliente)
        .then((primerRes) => {
          console.log("1° res :", primerRes);
          if (primerRes.estado) {
            getItemsCarritoSer().then((res) => {
              console.log("2° res: ", res);
              const item = res.data.find((it) => it.idProducto === producto.id);
              if (!item) {
                createItemCarritoService({
                  idCarrito: primerRes.data[0].id, // ver aqui
                  idProducto: producto.id,
                  cantidad: 1,
                  precioUnitario: producto.precio,
                });
              } else {
                //console.log(item);
                updateItemsCarrito(item.id, {
                  idCarrito: item.idCarrito,
                  idProducto: item.idProducto,
                  cantidad: item.cantidad + 1,
                  precioUnitario: item.precioUnitario,
                });
              }
            });
          } else {
            createCarritoService({ idUsuario: idCliente }).then((res) => {
              if (res.status === 201) {
                createItemCarritoService({
                  idCarrito: res.data.id,
                  idProducto: producto.id,
                  cantidad: 1,
                  precioUnitario: producto.precio,
                })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err.message));
              }
            });
          }
        })
        .catch((err) => console.log(err));
      SwAlertaComp(
        "Producto agregado con éxito!",
        "El producto se agrego al carrito 🛒",
        "success"
      );
      setTimeout(() => {
        navigate("/carrito");
      }, 2000);
    } else {
      SwAlertaComp(
        "No esta logueado,",
        "Debe iniciar sesión para poder comprar",
        "info"
      );
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  };
  return (
    <Card
      elevation={4}
      sx={{
        width: "90%",
        border: "1px solid rgba(0,0,0,0.3)",
        height: {
          md: "420px", // 60% en pantallas medianas (laptop)
        },
        display: "flex",
        flexDirection: "column", // Esto hace que los elementos se apilen verticalmente
      }}
    >
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain", // Cambiado de 'cover' a 'contain'
          backgroundRepeat: "no-repeat", // Evita que se repita la imagen
          backgroundPosition: "center", // Centra la imagen
          "&:hover": {
            scale: "1.1",
          },
        }}
        image={img}
        title={titulo}
      />
      <CardContent
        sx={{
          flexGrow: 1, // Esto hace que el CardContent ocupe todo el espacio disponible
        }}
      >
        <Typography gutterBottom variant="h5" component="div">
          {nombreProducto}{" "}
        </Typography>
        {/* <Typography variant="body2" sx={{ color: "text.secondary"}}>
          {descripcion}
        </Typography> */}
        <DescripcionConAlturaFija descripcion={descripcion} lineas={4} />
        <Typography>
          {cuponValido && id === cupon.idProducto ? (
            <>
              <span className="text-gray-400">
                <strike>${precio}</strike>
              </span>
              <span className="ml-1">Cupón Aplicado:</span>"{cupon.nombre}"
              <span>
                {" "}
                ${calcularDescuento(precio, cupon.porcentajeDescuento)}
              </span>
              <span className="ml-2 text-blue-700">
                {cupon.porcentajeDescuento}%
              </span>
              <LocalOfferIcon
                sx={{ marginLeft: 1 }}
                fontSize="medium"
                color="error"
              />
            </>
          ) : oferta ? (
            <>
              <span className="text-gray-400">
                <strike>${precio}</strike>
              </span>
              <span> ${calcularDescuento(precio, descuento)}</span>
              <span className="ml-2 text-blue-700">{descuento}%</span>
              <LocalOfferIcon fontSize="medium" color="success" />
            </>
          ) : (
            `$${precio}`
          )}{" "}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to={`/productos/${id}`}>
          <Button
            startIcon={<Visibility />}
            variant="outlined"
            size="small"
            sx={{
              "&:hover": {
                scale: "1.1",
              },
            }}
          >
            Detalle
          </Button>
        </Link>
        <Button
          onClick={() =>
            handleCompra({
              id,
              img,
              titulo,
              nombreProducto,
              descripcion,
              precio,
              oferta,
              descuento,
            })
          }
          variant="contained"
          size="small"
          sx={{
            "&:hover": {
              scale: "1.1",
            },
          }}
          startIcon={<ShoppingCartRounded />}
        >
          Comprar
        </Button>
      </CardActions>
    </Card>
  );
}
