import { useContext, useState } from "react";
import CartProduct from "./CartProduct.jsx";
import { Box } from "@mui/material";
import { useEffect } from "react";
import getProductos from "../services/getProductos.js";
import { CuponContext } from "../context/cuponContext.jsx";

// gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",

function Ofertas() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [ofertas, setOfertas] = useState([]);

  const { cuponValido, cupon } = useContext(CuponContext);

  useEffect(() => {
    getProductos()
      .then((res) => {
        const resultado = res.filter((producto) => {
          if (producto.oferta) {
            return producto;
          }
        });
        setOfertas(resultado);
      })
      .catch((err) => console.log(err));
  }, []);
  console.log(ofertas);
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // 1 columna en mobile
          sm: "repeat(2, 1fr)", // 2 columnas en tablet
          md: "repeat(3, 1fr)", // 3 columnas en desktop
        },
        gridTemplateRows: "1fr",
        placeItems: "center",
        gap: 2,
        margin: "8px",
      }}
    >
      {ofertas &&
        ofertas.map((oferta) => (
          <CartProduct
            key={oferta.id}
            cupon={cupon}
            cuponValido={cuponValido}
            id={oferta.id}
            img={oferta.imagenUrl}
            titulo={oferta.nombre}
            nombreoferta={oferta.nombre}
            descripcion={oferta.descripcion}
            precio={oferta.precio}
            calificacion={oferta.calificacion}
            descuento={oferta.descuento}
            oferta={oferta.oferta}
            onClick={() => setSelectedCard(oferta.id)}
            data-active={selectedCard === oferta.id ? "" : undefined}
            sx={{
              height: "100%",
              "&[data-active]": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selectedHover",
                },
              },
            }}
          ></CartProduct>
        ))}
    </Box>
  );
}

export default Ofertas;
