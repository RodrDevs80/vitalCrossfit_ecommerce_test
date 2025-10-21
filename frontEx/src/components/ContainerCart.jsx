import { useContext, useState } from "react";
import CartProduct from "./CartProduct.jsx";
import { Box } from "@mui/material";
import { useEffect } from "react";
import getProductos from "../services/getProductos.js";
import { CuponContext } from "../context/cuponContext.jsx";
import FilterBar from "./FilterBar.jsx";

// gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",

function ContainerCart() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    category: "",
    searchQuery: "",
    showNew: false,
    showOffers: false,
  });

  const { cuponValido, cupon } = useContext(CuponContext);

  useEffect(() => {
    getProductos()
      .then((res) => setProductos(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <FilterBar onFilterChange={setFiltros} />

      {console.log(filtros.category)}
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
          margin: "5px",
        }}
      >
        {productos &&
          productos
            .filter(
              (producto) =>
                producto.nombre
                  .toLowerCase()
                  .includes(filtros.searchQuery.toLowerCase()) ||
                producto.descripcion
                  .toLowerCase()
                  .includes(filtros.searchQuery.toLowerCase())
            )
            .map((producto) => (
              <CartProduct
                key={producto.id}
                cupon={cupon}
                cuponValido={cuponValido}
                id={producto.id}
                img={producto.imagenUrl}
                titulo={producto.nombre}
                nombreProducto={producto.nombre}
                descripcion={producto.descripcion}
                precio={producto.precio}
                calificacion={producto.calificacion}
                descuento={producto.descuento}
                oferta={producto.oferta}
                onClick={() => setSelectedCard(producto.id)}
                data-active={selectedCard === producto.id ? "" : undefined}
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
    </>
  );
}

export default ContainerCart;
